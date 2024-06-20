const Resource = require('../models/resourceModel');
const fs = require('fs');
const path = require('path');

const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

const createResource = async (req, res) => {
  try {
    const { title, description, type, date, webinarUrl, moduleUrl } = req.body;
    const userId = req.user.id;

    let resourceData = { title, description, type, date, user: userId };

    if (type === 'Video') {
      const videoExtension = getFileExtension(req.file.originalname);
      const videoUrl = `/uploads/${req.file.filename}`;
      resourceData.filePath = req.file.path;
      resourceData.videoExtension = videoExtension;
      resourceData.videoUrl = videoUrl;
    } else if (type === 'Article') {
      const articleExtension = getFileExtension(req.file.originalname);
      const articleUrl = `/uploads/${req.file.filename}`;
      resourceData.filePath = req.file.path;
      resourceData.articleExtension = articleExtension;
      resourceData.articleUrl = articleUrl;
    } else if (type === 'Webinar') {
      resourceData.webinarUrl = webinarUrl;
    } else if (type === 'Module') {
      resourceData.filePath = req.file.path;
      resourceData.moduleUrl = moduleUrl; // assuming moduleUrl is a URL to the module content
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
    res.status(200).json({ success: true, data: resource });
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
    // Optionally delete the file from the filesystem
    if (resource.filePath) {
      fs.unlink(path.join(__dirname, '..', resource.filePath), (err) => {
        if (err) {
          console.error('Failed to delete file:', err);
        }
      });
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

const getVideo = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    if (resource.type !== 'Video') {
      return res.status(400).json({ success: false, error: 'Resource is not a video' });
    }

    const videoPath = path.join(__dirname, '..', resource.filePath);
    res.sendFile(videoPath);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getArticle = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    if (resource.type !== 'Article') {
      return res.status(400).json({ success: false, error: 'Resource is not an article' });
    }

    const articlePath = path.join(__dirname, '..', resource.filePath);
    res.sendFile(articlePath);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getWebinar = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    if (resource.type !== 'Webinar') {
      return res.status(400).json({ success: false, error: 'Resource is not a webinar' });
    }

    res.redirect(resource.webinarUrl);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getModule = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    if (resource.type !== 'Module') {
      return res.status(400).json({ success: false, error: 'Resource is not a module' });
    }

    const modulePath = path.join(__dirname, '..', resource.filePath);
    res.sendFile(modulePath);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createResource,
  getResourceById,
  updateResourceById,
  deleteResourceById,
  getResources,
  getVideo,
  getArticle,
  getWebinar,
  getModule,
};
