const Case = require('../models/caseModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// Create a new case
exports.createCase = async (req, res) => {
  try {
    const { title, description, legalCategory, urgency, attachments } = req.body;
    
    // Ensure the user is a CLIENT
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'CLIENT') {
      return res.status(403).json({ message: 'Only clients can create cases' });
    }

    const newCase = new Case({
      title,
      description,
      clientId: req.user.id,
      legalCategory,
      urgency: urgency || 'MEDIUM',
      attachments: attachments || []
    });

    await newCase.save();
    res.status(201).json({ 
      success: true,
      data: newCase
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all cases (with filtering options)
exports.getAllCases = async (req, res) => {
  try {
    let query = {};
    
    // If user is a CLIENT, only show their cases
    if (req.user.role === 'CLIENT') {
      query.clientId = req.user.id;
    }
    // If user is a LAWYER, show unassigned cases + their assigned cases
    else if (req.user.role === 'LAWYER') {
      query = {
        $or: [
          { assignedLawyer: req.user.id },
          { assignedLawyer: null }
        ]
      };
    }
    // ADMIN can see all cases
    
    // Apply filters if provided
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.category) {
      query.legalCategory = req.query.category;
    }

    const cases = await Case.find(query)
      .populate('clientId', 'fullName email')
      .populate('assignedLawyer', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cases.length,
      data: cases
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single case by ID
exports.getCaseById = async (req, res) => {
  try {
    const caseId = req.params.id;
    
    const caseItem = await Case.findById(caseId)
      .populate('clientId', 'fullName email phone')
      .populate('assignedLawyer', 'fullName email phone lawFirm')
      .populate('notes.author', 'fullName role');
    
    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Check if user has permission to view this case
    if (
      req.user.role === 'CLIENT' && 
      caseItem.clientId._id.toString() !== req.user.id &&
      req.user.role === 'LAWYER' && 
      caseItem.assignedLawyer && 
      caseItem.assignedLawyer._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this case'
      });
    }

    res.status(200).json({
      success: true,
      data: caseItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update a case
exports.updateCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const updates = req.body;
    
    // Find the case first to check permissions
    const caseItem = await Case.findById(caseId);
    
    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Permission checks based on role
    if (req.user.role === 'CLIENT') {
      // Clients can only update their own cases and only certain fields
      if (caseItem.clientId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own cases'
        });
      }
      
      // Restrict what clients can update
      const allowedUpdates = ['title', 'description', 'urgency', 'attachments'];
      Object.keys(updates).forEach(key => {
        if (!allowedUpdates.includes(key)) {
          delete updates[key];
        }
      });
    } else if (req.user.role === 'LAWYER') {
      // Lawyers can only update cases assigned to them
      if (
        caseItem.assignedLawyer && 
        caseItem.assignedLawyer.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: 'You can only update cases assigned to you'
        });
      }
      
      // Restrict what lawyers can update
      const allowedUpdates = ['status', 'notes'];
      Object.keys(updates).forEach(key => {
        if (!allowedUpdates.includes(key)) {
          delete updates[key];
        }
      });
    }
    
    // Perform the update
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      updates,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedCase
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Assign a lawyer to a case
exports.assignLawyer = async (req, res) => {
  try {
    const { caseId, lawyerId } = req.body;
    
    // Check if case exists
    const caseItem = await Case.findById(caseId);
    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    // Check if lawyer exists and is actually a lawyer
    const lawyer = await User.findById(lawyerId);
    if (!lawyer || lawyer.role !== 'LAWYER') {
      return res.status(400).json({
        success: false,
        message: 'Invalid lawyer ID'
      });
    }
    
    // Only admin or the lawyer themselves can accept a case
    if (req.user.role !== 'ADMIN' && req.user.id !== lawyerId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to assign this case'
      });
    }
    
    // Update the case
    caseItem.assignedLawyer = lawyerId;
    caseItem.status = 'ASSIGNED';
    await caseItem.save();
    
    res.status(200).json({
      success: true,
      data: caseItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Add a note to a case
exports.addNote = async (req, res) => {
  try {
    const { caseId, text } = req.body;
    
    // Find the case
    const caseItem = await Case.findById(caseId);
    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    // Check permission to add note
    if (
      (req.user.role === 'CLIENT' && caseItem.clientId.toString() !== req.user.id) ||
      (req.user.role === 'LAWYER' && 
       (!caseItem.assignedLawyer || caseItem.assignedLawyer.toString() !== req.user.id))
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add notes to this case'
      });
    }
    
    // Add the note
    const newNote = {
      text,
      author: req.user.id
    };
    
    caseItem.notes.push(newNote);
    await caseItem.save();
    
    // Populate the author info before returning
    const populatedCase = await Case.findById(caseId)
      .populate('notes.author', 'fullName role');
    
    res.status(200).json({
      success: true,
      data: populatedCase.notes[populatedCase.notes.length - 1]
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
