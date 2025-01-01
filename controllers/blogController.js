const { Op } = require("sequelize");
const { Blog } = require("../models");
const sharp = require("sharp");

class BlogController {
  static async createBlog(req, res, next) {
    try {
      const { title, author, content, date } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "Image is required." });
      }

      const compressedImage = await sharp(req.file.buffer)
        .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
        .toBuffer();

      const blog = await Blog.create({
        title,
        author,
        content,
        date,
        image: compressedImage, // Store image buffer
        contentType: req.file.mimetype,
      });

      res.status(201).json({ message: "Blog created successfully.", blog });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error adding Blog.", details: error.message });
    }
  }

  static async getBlogs(req, res, next) {
    const { searchTerm } = req.query;
    try {
      const blogs = await Blog.findAll({
        where: searchTerm
          ? {
              title: {
                [Op.like]: `%${searchTerm}%`,
              },
            }
          : {},
      });
      res.status(200).json({ blogs });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching Blog.", details: error.message });
    }
  }

  static async getBlogById(req, res, next) {
    try {
      const blog = await Blog.findByPk(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found." });
      }
      res.status(200).json({ blog });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching Blog.", details: error.message });
    }
  }

  static async updateBlog(req, res, next) {
    const { id } = req.params;
    const { title, author, content, date } = req.body;
    try {
      const blog = await Blog.findByPk(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found." });
      }
      const compressedImage = req.file.buffer
        ? await sharp(req.file.buffer)
            .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
            .toBuffer()
        : null;
      await blog.update({
        title,
        author,
        content,
        date,
        image: compressedImage || blog.image,
        contentType: req.file?.mimetype || blog.contentType,
      });
      res.status(200).json({ message: "Blog updated successfully.", blog });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error updating Blog.", details: error.message });
    }
  }

  static async deleteBlog(req, res, next) {
    const { id } = req.params;
    try {
      const blog = await Blog.findByPk(id);

      if (!blog) {
        return res.status(404).json({ error: "Blog not found." });
      }

      await blog.destroy();
      res.status(200).json({ message: "Blog deleted successfully." });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error deleting Blog.", details: error.message });
    }
  }

  static async reOrder(req, res) {
    const { order } = req.body;

    try {
      const updatePromises = order.map((item) =>
        Blog.update(
          { customOrder: item.customOrder },
          { where: { id: item.blogId } }
        )
      );

      await Promise.all(updatePromises);

      res.status(200).json({ message: "Blogs reordered successfully" });
    } catch (error) {
      res.status(500).json({
        error: "Failed to reorder blogs",
        details: error.message,
      });
    }
  }
}

module.exports = BlogController;
