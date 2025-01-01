const { Op } = require("sequelize");
const { Faqcategory, Faq } = require("../models");

class FaqCategoryController {
  static async createFaqCategory(req, res, next) {
    const title = req.body.title;
    try {
      const existingCategory = await Faqcategory.findOne({
        where: {
          title,
        },
      });

      if (existingCategory) {
        return res.status(400).json({ error: "Category already exists" });
      }
      const faqCategory = await Faqcategory.create({
        title,
      });
      return res
        .status(201)
        .json({ message: "Category created successfully", faqCategory });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to add category", details: error.message });
    }
  }

  static async getAllFaqCategories(req, res, next) {
    try {
      const faqCategories = await Faqcategory.findAll({
        order: [["customOrder", "ASC"]],
      });
      return res.status(200).json({ faqCategories });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get categories", details: error.message });
    }
  }

  static async updateFaqCategory(req, res, next) {
    const id = req.params.id;
    const title = req.body.title;
    try {
      const isExists = await Faqcategory.findOne({
        where: {
          title,
          id: { [Op.not]: id },
        },
      });
      if (isExists) {
        return res.status(400).json({ error: "Category already exists" });
      }
      const faqCategory = await Faqcategory.findByPk(id);
      if (!faqCategory) {
        return res.status(404).json({ error: "Category not found" });
      }
      faqCategory.update({ title });
      return res
        .status(200)
        .json({ message: "Category updated successfully", faqCategory });
    } catch (error) {
      res.status(500).json({
        error: "Failed to update category",
        details: error.message,
      });
    }
  }

  static async deleteFaqCategory(req, res, next) {
    const id = req.params.id;
    try {
      const faqCategory = await Faqcategory.findByPk(id);
      if (!faqCategory) {
        return res.status(404).json({ error: "Category not found" });
      }
      await faqCategory.destroy();
      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to delete category", details: error.message });
    }
  }

  static async addMultipleFaqs(req, res, next) {
    const { faqs, faqcategoryId } = req.body;

    try {
      // Check if the category exists
      const isCategoryExists = await Faqcategory.findByPk(faqcategoryId);
      if (!isCategoryExists) {
        return res.status(404).json({ error: "Category not found" });
      }

      // // Check if any of the FAQs already exist
      // const existingFaqs = await Faq.findAll({
      //   where: {
      //     [Sequelize.Op.or]: faqs.map((faq) => ({
      //       [Sequelize.Op.and]: [
      //         { question: faq.question },
      //         { answer: faq.answer },
      //       ],
      //     })),
      //   },
      // });

      // if (existingFaqs.length > 0) {
      //   return res
      //     .status(400)
      //     .json({ error: "Some FAQs already exist", existingFaqs });
      // }

      // Add new FAQs
      const newFaqs = faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
        faqcategoryId,
      }));

      const createdFaqs = await Faq.bulkCreate(newFaqs);

      return res
        .status(201)
        .json({ message: "FAQs added successfully", createdFaqs });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to add FAQs", details: error.message });
    }
  }

  static async getFaqs(req, res, next) {
    const { id } = req.params;
    try {
      const faqs = await Faq.findAll({
        where: {
          faqcategoryId: id,
        },
      });
      res.status(200).json({ faqs });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get FAQs", details: error.message });
    }
  }

  static async editFaq(req, res, next) {
    const { id } = req.params;
    const { question, answer } = req.body;
    try {
      const faq = await Faq.findByPk(id);
      if (!faq) {
        return res.status(404).json({ error: "FAQ not found" });
      }
      faq.question = question;
      faq.answer = answer;
      await faq.save();
      res.status(200).json({ message: "FAQ updated successfully", faq });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to update faq", details: error.message });
    }
  }

  static async deleteFaq(req, res, next) {
    const { id } = req.params;
    try {
      const faq = await Faq.findByPk(id);
      if (!faq) {
        return res.status(404).json({ error: "FAQ not found" });
      }
      await faq.destroy();
      res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
      res.status(500).json({
        error: "Failed to delete faq",
        details: error.message,
      });
    }
  }

  static async reOrder(req, res, next) {
    const { order } = req.body;
    try {
      const updatePromises = order.map((item) =>
        Faqcategory.update(
          { customOrder: item.customOrder },
          { where: { id: item.categoryId } }
        )
      );
      await Promise.all(updatePromises);

      res
        .status(200)
        .json({ message: "Faq categories reordered successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to reorder products", details: error.message });
    }
  }
}

module.exports = FaqCategoryController;
