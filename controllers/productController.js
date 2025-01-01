const { Op } = require("sequelize");
const { Product } = require("../models");
const sharp = require("sharp");
const { PDFDocument } = require("pdf-lib");

class ProductController {
  static async addProduct(req, res, next) {
    try {
      const { title, subTitle, description } = req.body;

      const image = req.files?.image ? req.files.image[0] : null;
      const brochure = req.files?.brochure ? req.files?.brochure[0] : null;

      if (!image) {
        return res.status(400).json({ error: "Image is required." });
      }

      // Compress the image
      const compressedImage = await sharp(image.buffer)
        .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
        .toBuffer();

      // .resize({ width: 1024 }) // Resize to a reasonable dimension

      // Compress the brochure if it's a PDF
      let compressedBrochure = null;
      if (brochure) {
        const pdfDoc = await PDFDocument.load(brochure.buffer);
        const pdfBytes = await pdfDoc.save({ useObjectStreams: true }); // Compress and save
        compressedBrochure = Buffer.from(pdfBytes);
      }

      const existingProduct = await Product.findOne({ where: { title } });
      if (existingProduct) {
        return res
          .status(400)
          .json({ error: "Product with this title already exists." });
      }

      const product = await Product.create({
        title,
        subTitle,
        description,
        image: compressedImage, // Store compressed image buffer
        contentType: "image/jpeg", // Store compressed image mimetype
        brochure: compressedBrochure, // Store compressed brochure
        userId: req.user.id,
      });

      res
        .status(201)
        .json({ message: "Product created successfully.", product });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error creating Product.", details: error.message });
    }
  }

  static async getProducts(req, res, next) {
    try {
      const products = await Product.findAll({
        attributes: [
          "id",
          "title",
          "subTitle",
          "description",
          "image",
          "contentType",
        ],
        order: [["customOrder", "ASC"]],
      });
      res.status(200).json({ products });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching products.", details: error.message });
    }
  }

  static async getPdf(req, res, next) {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id, {
        attributes: ["brochure"],
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      res.status(200).json({ pdf: product.brochure });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get brochure", details: error.message });
    }
  }

  static async updateProduct(req, res, next) {
    const { id } = req.params;
    const { title, subTitle, description } = req.body;
    const image = req.files?.image ? req.files.image[0] : null;
    const brochure = req.files?.brochure ? req.files?.brochure[0] : null;

    let compressedImage = null;
    if (image) {
      const compressedImage = await sharp(image.buffer)
        .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
        .toBuffer();
    }

    // .resize({ width: 1024 }) // Resize to a reasonable dimension

    // Compress the brochure if it's a PDF
    let compressedBrochure = null;
    if (brochure) {
      const pdfDoc = await PDFDocument.load(brochure.buffer);
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true }); // Compress and save
      compressedBrochure = Buffer.from(pdfBytes);
    }

    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
      const existingProduct = await Product.findOne({
        where: {
          title,
          id: {
            [Op.not]: id,
          },
        },
      });
      if (existingProduct) {
        return res
          .status(400)
          .json({ error: "Product with this title already exists." });
      }
      await product.update({
        title,
        subTitle,
        description,
        image: image ? compressedBrochure : product.image, // Store image buffer
        contentType: image ? image.mimetype : product.contentType, // Store image content type
        brochure: brochure ? compressedBrochure : product.brochure, // Store brochure buffer
        userId: req.user.id,
      });
      res
        .status(200)
        .json({ message: "Product updated successfully.", product });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error updating Product.", details: error.message });
    }
  }

  static async deleteProduct(req, res, next) {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }

      await product.destroy();
      res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error deleting Product.", details: error.message });
    }
  }

  static async reOrder(req, res, next) {
    const { order } = req.body;
    try {
      const updatePromises = order.map((item) =>
        Product.update(
          { customOrder: item.customOrder },
          { where: { id: item.productId } }
        )
      );
      await Promise.all(updatePromises);

      res.status(200).json({ message: "Products reordered successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to reorder products", details: error.message });
    }
  }
}

module.exports = ProductController;
