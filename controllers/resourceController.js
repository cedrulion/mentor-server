const Resource = require('../models/resourceModel');
const fs = require('fs');
const path = require('path');

const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

const createResource = async (req, res) => {
  try {
    const { title, description, type ,filePath} = req.body;
    const userId = req.user.id;

    let resourceData = { title, description, type, user: userId ,filePath};

    if (type === 'Video') {
      const videoExtension = req.file ? getFileExtension(req.file.originalname) : null;
      const videoUrl = req.file ? `${req.file.filename}` : null;
      resourceData.videoExtension = videoExtension;
      resourceData.videoUrl = videoUrl;
    } else if (type === 'Article') {
      const articleExtension = req.file ? getFileExtension(req.file.originalname) : null;
      resourceData.articleExtension = articleExtension;
      const articleUrl = req.file ? `/articles/${req.file.filename}` : null;
      resourceData.articleUrl = articleUrl;
    } else if (type === 'Webinar') {
      resourceData.webinarUrl = req.body.webinarUrl;
    }

    const resource = await Resource.create(resourceData);
    res.status(201).json({ success: true, data: resource });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    let resourceData = { success: true, data: {} };

    if (resource.type === 'Video') {
      resourceData.data.videoUrl = resource.videoUrl ? resource.videoUrl : null;
    } else if (resource.type === 'Article') {
      resourceData.data.articleUrl = resource.articleUrl ? resource.articleUrl : null;
    } else if (resource.type === 'Webinar') {
      resourceData.data.webinarUrl = resource.webinarUrl ? resource.webinarUrl : null;
    } else {
      resourceData.data = resource;
    }

    res.status(200).json(resourceData);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateResourceById = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { title, description, type },
      { new: true }
    );
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }
    res.status(200).json({ success: true, data: resource });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteResourceById = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createResource,
  getResourceById,
  updateResourceById,
  deleteResourceById,
  getResources,
};
