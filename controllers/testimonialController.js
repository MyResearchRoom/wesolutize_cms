const { Testimonial } = require("../models");
const sharp = require("sharp");

class TestimonialController {
  // Create a new testimonial
  static async createTestimonial(req, res) {
    const { name, rating, review } = req.body;
    const compressedImage = req.file
      ? await sharp(req.file.buffer)
          .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
          .toBuffer()
      : null;
    const profile = compressedImage;
    const contentType = req.file ? req.file.mimetype : null;

    try {
      const existingTestimonial = await Testimonial.findOne({
        where: {
          review,
          name,
        },
      });

      if (existingTestimonial) {
        return res.status(400).json({
          error: "Testimonial already exists with same name and review",
        });
      }

      const testimonial = await Testimonial.create({
        name,
        rating,
        review,
        profile,
        contentType,
        userId: req.user.id,
      });

      return res.status(201).json({
        message: "Testimonial created successfully",
        testimonial,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }

  // Fetch all testimonials
  static async getAllTestimonials(req, res) {
    try {
      const testimonials = await Testimonial.findAll();
      return res.status(200).json({ testimonials });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }

  // Update a testimonial
  static async updateTestimonial(req, res) {
    const { id } = req.params;
    const { name, rating, review } = req.body;
    const compressedImage = req.file
      ? await sharp(req.file.buffer)
          .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
          .toBuffer()
      : null;
    const contentType = req.file ? req.file.mimetype : null;

    try {
      const testimonial = await Testimonial.findByPk(id);
      if (!testimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }

      await testimonial.update({
        name,
        rating,
        review,
        profile: compressedImage || testimonial.profile,
        contentType: contentType || testimonial.contentType,
      });

      return res
        .status(200)
        .json({ message: "Testimonial updated successfully", testimonial });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }

  // Delete a testimonial
  static async deleteTestimonial(req, res) {
    const { id } = req.params;

    try {
      const testimonial = await Testimonial.findByPk(id);
      if (!testimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }

      await testimonial.destroy();
      return res
        .status(200)
        .json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }
}

module.exports = TestimonialController;
