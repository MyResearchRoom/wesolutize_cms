const { Newsletter } = require("../models");

class NewsletterController {
  static async createNewsletter(req, res, next) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!regex.test(req.body.email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    try {
      const existingEmail = await Newsletter.findOne({
        where: { email: req.body.email },
      });
      if (existingEmail) {
        return res.status(200).json({ message: "Newsletter already signup" });
      }
      const newsletter = await Newsletter.create({
        email: req.body.email,
      });
      res.status(200).json({ message: "Newsletter signup successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed signup newsletter", details: error.message });
    }
  }

  static async getNewsletters(req, res, next) {
    try {
      const newsletters = await Newsletter.findAll();
      res.status(200).json({ newsletters });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get newsletters", details: error.message });
    }
  }

  static async deleteNewsletter(req, res, next) {
    try {
      const newsletter = await Newsletter.findOne({
        where: { id: req.params.id },
      });
      if (!newsletter) {
        return res.status(404).json({ message: "Newsletter not found" });
      }
      await newsletter.destroy();
      res.status(200).json({ message: "Newsletter deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to remove email", details: error.message });
    }
  }
}

module.exports = NewsletterController;
