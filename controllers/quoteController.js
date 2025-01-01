const { Quote } = require("../models");
const nodemailer = require("nodemailer");

class QuoteController {
  static async addQuote(req, res, next) {
    try {
      const {
        firstName,
        lastName,
        email,
        contact,
        company,
        city,
        requirements,
        budget,
      } = req.body;

      const newQuote = await Quote.create({
        firstName,
        lastName,
        email,
        contact,
        company,
        city,
        requirements,
        budget,
      });

      const transporter = nodemailer.createTransport({
        service: "gmail", // Use Gmail or another service
        auth: {
          user: process.env.EMAIL, // Replace with your email
          pass: process.env.EMAIL_PASSWORD, // Replace with your email password or use environment variables
        },
      });

      // Email content
      const userMailOptions = {
        from: process.env.EMAIL, // Replace with your email
        to: email, // Send the email to the user's provided email
        subject: "Thank you for contacting us!",
        text: `
          Hi ${firstName} ${lastName},

          Thank you for reaching out to us. We have received your message:

          Email: ${email}
          Contact: ${contact}
          Company: ${company}
          City: ${city}
          Requirements: ${requirements}
          Budget: ${budget}

          Our team will get back to you shortly.

          Best regards,
          NikolEV
        `,
      };

      // Email content for the company
      const companyMailOptions = {
        from: process.env.EMAIL, // Company email
        to: process.env.COMPANY_NOTIFICATION_EMAIL, // Email for company notifications
        subject: "New Contact Inquiry",
        text: `
          Hello Team,
  
          A new contact inquiry has been submitted through the website:
  
          Email: ${email}
          Contact: ${contact}
          Company: ${company}
          City: ${city}
          Requirements: ${requirements}
          Budget: ${budget}

  
          Please follow up with the user.
  
          Best regards,
          Website Notification System
        `,
      };

      setImmediate(() => {
        transporter.sendMail(userMailOptions, (err) => {
          if (err) console.error("Error sending user email:", err.message);
        });

        transporter.sendMail(companyMailOptions, (err) => {
          if (err) console.error("Error sending company email:", err.message);
        });
      });

      // await Promise.all([
      //   transporter.sendMail(userMailOptions),
      //   transporter.sendMail(companyMailOptions),
      // ]);

      res.status(201).json({
        message: "Quote created successfully.",
        data: newQuote,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error creating quote.",
        details: error.message,
      });
    }
  }

  static async getAllQuotes(req, res, next) {
    try {
      const quotes = await Quote.findAll();
      res.status(200).json({ quotes });
    } catch (error) {
      res.status(500).json({
        error: "Error getting quotes.",
        details: error.message,
      });
    }
  }

  static async deleteQuote(req, res, next) {
    try {
      const { id } = req.params;
      const quote = await Quote.findByPk(id);

      if (!quote) {
        return res.status(404).json({ error: "Quote not found." });
      }

      await quote.destroy();
      res.status(200).json({ message: "Quote deleted successfully." });
    } catch (error) {
      res.status(500).json({
        error: "Error deleting quote.",
        details: error.message,
      });
    }
  }
}

module.exports = QuoteController;
