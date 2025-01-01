const { Op } = require("sequelize");
const { Chargerlocation } = require("../models");
const sharp = require("sharp");

class ChargerlocationController {
  static async addChargerLocation(req, res, next) {
    const { chargingStation, chargerType, city, location, googleMapLink } =
      req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Site image is required" });
    }

    // Compress the image
    const compressedImage = await sharp(req.file.buffer)
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .toBuffer();

    try {
      const chargerLocation = await Chargerlocation.create({
        chargingStation,
        chargerType,
        city,
        location,
        googleMapLink,
        image: compressedImage,
        contentType: req.file.mimetype,
      });
      res.status(201).json({ chargerLocation });
    } catch (error) {
      res.status(500).json({
        error: "Failed to add chager location",
        details: error.message,
      });
    }
  }

  static async getAllChargerLocations(req, res, next) {
    const { searchTerm } = req.query;

    const whereClause = {};
    if (searchTerm) {
      whereClause[Op.or] = [
        { chargingStation: { [Op.like]: `%${searchTerm}%` } },
        { location: { [Op.like]: `%${searchTerm}%` } },
        { city: { [Op.like]: `%${searchTerm}%` } },
      ];
    }
    try {
      const data = await Chargerlocation.findAll({
        where: whereClause,
        order: [["customOrder", "ASC"]],
      });

      res.status(200).json({ chargerLocations: data });
    } catch (error) {
      res.status(500).json({
        error: "Failed to get charger locations",
        details: error.message,
      });
    }
  }

  static async updateChargerLocation(req, res, next) {
    const { id } = req.params;
    const { chargingStation, chargerType, city, location, googleMapLink } =
      req.body;

    try {
      const chargerLocation = await Chargerlocation.findByPk(id);
      if (!chargerLocation) {
        return res.status(404).json({ error: "Charger location not found" });
      }
      const compressedImage = req.file.buffer
        ? await sharp(req.file.buffer)
            .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
            .toBuffer()
        : null;
      await chargerLocation.update({
        chargingStation,
        chargerType,
        city,
        location,
        googleMapLink,
        image: compressedImage || chargerLocation.image,
        contentType: req.file?.mimetype || chargerLocation.contentType,
      });
      res.status(200).json({ chargerLocation });
    } catch (error) {
      res.status(500).json({
        error: "Failed to update charger location",
        details: error.message,
      });
    }
  }

  static async deleteChargerLocation(req, res, next) {
    const { id } = req.params;
    try {
      const chargerLocation = await Chargerlocation.findByPk(id);
      if (!chargerLocation) {
        return res.status(404).json({ error: "Charger location not found" });
      }
      await chargerLocation.destroy();
      res
        .status(200)
        .json({ message: "Charger location deleted successfully" });
    } catch (error) {
      res.status(500).json({
        error: "Failed to delete charger location",
        details: error.message,
      });
    }
  }

  static async reOrder(req, res) {
    const { order } = req.body;

    try {
      const updatePromises = order.map((item) =>
        Chargerlocation.update(
          { customOrder: item.customOrder },
          { where: { id: item.chargerId } }
        )
      );

      await Promise.all(updatePromises);

      res.status(200).json({ message: "Chargers reordered successfully" });
    } catch (error) {
      res.status(500).json({
        error: "Failed to reorder chargers",
        details: error.message,
      });
    }
  }
}

module.exports = ChargerlocationController;
