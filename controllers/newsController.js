const { Op } = require("sequelize");
const { News } = require("../models");

class NewsController {
  static async createNews(req, res, next) {
    try {
      const { title, date, url } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "Image is required." });
      }

      const existingNews = await News.findOne({ where: { url } });
      if (existingNews) {
        return res
          .status(400)
          .json({ error: "News with this url already exists." });
      }

      const news = await News.create({
        title,
        date,
        url,
        image: req.file.buffer, // Store image buffer
        contentType: req.file.mimetype,
        userId: req.user.id,
      });

      res.status(201).json({ message: "News created successfully.", news });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error creating news.", details: error.message });
    }
  }

  static async getNews(req, res, next) {
    try {
      const news = await News.findAll({
        order: [["customOrder", "ASC"]],
      });

      res.status(200).json({ news });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching news.", details: error.message });
    }
  }

  static async updateNews(req, res, next) {
    const { id } = req.params;
    const { title, date, url } = req.body;
    try {
      const news = await News.findByPk(id);
      if (!news) {
        return res.status(404).json({ message: "News not found." });
      }
      const existingNews = await News.findOne({
        where: {
          url,
          id: {
            [Op.not]: id,
          },
        },
      });
      if (existingNews) {
        return res
          .status(400)
          .json({ error: "News with this url already exists." });
      }
      await news.update({
        title,
        date,
        url,
        image: req.file?.buffer || news.image,
        contentType: req.file?.mimetype || news.contentType,
      });
      res.status(200).json({ message: "News updated successfully.", news });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error updating news.", details: error.message });
    }
  }

  static async deleteNews(req, res, next) {
    const { id } = req.params;
    try {
      const news = await News.findByPk(id);

      if (!news) {
        return res.status(404).json({ error: "News not found." });
      }

      await news.destroy();
      res.status(200).json({ message: "News deleted successfully." });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error deleting news.", details: error.message });
    }
  }

  static async reOrder(req, res, next) {
    const { order } = req.body;
    try {
      const updatePromises = order.map((item) =>
        News.update(
          { customOrder: item.customOrder },
          { where: { id: item.newsId } }
        )
      );
      await Promise.all(updatePromises);

      res.status(200).json({ message: "News reordered successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to reorder news", details: error.message });
    }
  }
}

module.exports = NewsController;
