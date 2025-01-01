const { Contact } = require("../models");
const nodemailer = require("nodemailer");

class ContactController {
  static async addContact(req, res, next) {
    try {
      const { name, email, contact, message } = req.body;

      // Add the new contact to the database
      const newContact = await Contact.create({
        name,
        email,
        contact,
        message,
      });

      // Set up Nodemailer transporter (using Gmail in this example)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL, // Company email for authentication
          pass: process.env.EMAIL_PASSWORD, // Company email password or app password
        },
      });

      // Email content for the user
      const userMailOptions = {
        from: process.env.EMAIL, // Company email
        to: email, // User's email
        subject: "Thank you for contacting us!",
        text: `
          Hi ${name},
  
          Thank you for reaching out to us. We have received your message:
  
          Message: ${message}
          Email: ${email}
          Contact: ${contact}
  
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
  
          Name: ${name}
          Email: ${email}
          Contact: ${contact}
          Message: ${message}
  
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

      // Respond to the client
      res.status(201).json({
        message: "Contact created successfully, and emails sent.",
        data: newContact,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        error: "Error creating contact.",
        details: error.message,
      });
    }
  }

  static async getAllContacts(req, res, next) {
    try {
      const contacts = await Contact.findAll();
      res.status(200).json({ contacts });
    } catch (error) {
      res.status(500).json({
        error: "Error getting contacts.",
        details: error.message,
      });
    }
  }

  static async deleteContact(req, res, next) {
    try {
      const { id } = req.params;
      const contact = await Contact.findByPk(id);

      if (!contact) {
        return res.status(404).json({ error: "Contact not found." });
      }

      await contact.destroy();
      res.status(200).json({ message: "Contact deleted successfully." });
    } catch (error) {
      res.status(500).json({
        error: "Error deleting contact.",
        details: error.message,
      });
    }
  }
}

module.exports = ContactController;
