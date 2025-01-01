const { Partnership } = require("../models");
const nodemailer = require("nodemailer");

class partnershipController {
  static async addPartnership(req, res, next) {
    try {
      const {
        firstName,
        lastName,
        email,
        contact,
        city,
        state,
        comments,
        lookingFor,
        budget,
      } = req.body;

      const newPartnership = await Partnership.create({
        firstName,
        lastName,
        email,
        contact,
        city,
        state,
        comments,
        lookingFor,
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
          City: ${city}
          State: ${state}
          Comments: ${comments}
          Looking for: ${lookingFor}
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
        subject: "New Partnership Inquiry",
        text: `
          Hello Team,
  
          A new partnership inquiry has been submitted through the website:
  
          Email: ${email}
          Contact: ${contact}
          City: ${city}
          State: ${state}
          Comments: ${comments}
          Looking for: ${lookingFor}
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
        message: "Partnership created successfully.",
        data: newPartnership,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error creating partnership.",
        details: error.message,
      });
    }
  }

  static async getAllPartnerships(req, res, next) {
    try {
      const partnerships = await Partnership.findAll();
      res.status(200).json({ partnerships });
    } catch (error) {
      res.status(500).json({
        error: "Error getting partnerships.",
        details: error.message,
      });
    }
  }

  static async deletePartnership(req, res, next) {
    try {
      const { id } = req.params;
      const partnership = await Partnership.findByPk(id);

      if (!partnership) {
        return res.status(404).json({ error: "Partnership not found." });
      }

      await partnership.destroy();
      res.status(200).json({ message: "Partnership deleted successfully." });
    } catch (error) {
      res.status(500).json({
        error: "Error deleting partnership.",
        details: error.message,
      });
    }
  }
}

module.exports = partnershipController;
