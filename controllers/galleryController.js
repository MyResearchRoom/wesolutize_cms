const sharp = require("sharp");
const { Gallery } = require("../models");

class GalleryController {
  static async createGallery(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ error: "Please provide at least one image." });
      }

      const type = req.body.type;

      // Validate image count
      if (req.files.length > 5) {
        return res
          .status(400)
          .json({ error: "You can upload a maximum of 5 images at a time." });
      }

      // Array to store created galleries
      const galleryEntries = [];

      for (const file of req.files) {
        const gallery = await Gallery.create({
          image: await sharp(file.buffer)
            .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
            .toBuffer(), // Store image buffer
          contentType: file.mimetype, // Store MIME type
          type: type, // Gallery type from body
          userId: req.user.id, // Assuming `req.user.id` contains the authenticated user's ID
        });
        galleryEntries.push(gallery);
      }

      res.status(201).json({
        message: "Gallery created successfully.",
        gallery: galleryEntries,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error adding gallery.",
        details: error.message,
      });
    }
  }

  static async getGallery(req, res, next) {
    try {
      const type = req.query.type;
      const gallery = await Gallery.findAll({
        where: {
          type,
        },
      });

      res.status(200).json({ gallery });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching Gallery.", details: error.message });
    }
  }

  static async deleteGallery(req, res, next) {
    const { id } = req.params;
    try {
      const gallery = await Gallery.findByPk(id);

      if (!gallery) {
        return res.status(404).json({ error: "Image not found." });
      }

      await gallery.destroy();
      res.status(200).json({ message: "Image deleted successfully." });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error deleting image.", details: error.message });
    }
  }
}

module.exports = GalleryController;
