const { Op } = require("sequelize");
const { Partner } = require("../models");
const sharp = require("sharp");

class PartnerController {
  static async createPartner(req, res, next) {
    try {
      const { title } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "Image is required." });
      }

      const compressedImage = await sharp(req.file.buffer)
        .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
        .toBuffer();

      const existingPartner = await Partner.findOne({ where: { title } });
      if (existingPartner) {
        return res
          .status(400)
          .json({ error: "Partner with this title already exists." });
      }

      const partner = await Partner.create({
        title,
        image: compressedImage, // Store image buffer
        contentType: req.file.mimetype,
        userId: req.user.id,
      });

      res
        .status(201)
        .json({ message: "Partner created successfully.", partner });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error adding Partner.", details: error.message });
    }
  }

  static async getPartners(req, res, next) {
    try {
      const partners = await Partner.findAll();

      res.status(200).json({ partners });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching Partner.", details: error.message });
    }
  }

  static async updatePartner(req, res, next) {
    const { id } = req.params;
    const { title } = req.body;
    try {
      const partner = await Partner.findByPk(id);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found." });
      }
      const existingPartner = await Partner.findOne({
        where: {
          title,
          id: {
            [Op.not]: id,
          },
        },
      });
      if (existingPartner) {
        return res
          .status(400)
          .json({ error: "Partner with this title already exists." });
      }

      const compressedImage = req.file.buffer
        ? await sharp(req.file.buffer)
            .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
            .toBuffer()
        : null;
      await partner.update({
        title,
        image: compressedImage || partner.image,
        contentType: req.file?.mimetype || partner.contentType,
      });
      res
        .status(200)
        .json({ message: "Partner updated successfully.", partner });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error updating Partner.", details: error.message });
    }
  }

  static async deletePartner(req, res, next) {
    const { id } = req.params;
    try {
      const partner = await Partner.findByPk(id);

      if (!partner) {
        return res.status(404).json({ error: "Partner not found." });
      }

      await partner.destroy();
      res.status(200).json({ message: "Partner deleted successfully." });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error deleting Partner.", details: error.message });
    }
  }
}

module.exports = PartnerController;
