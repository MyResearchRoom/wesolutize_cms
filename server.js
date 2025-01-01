const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");

const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const newsRoutes = require("./routes/newsRoutes");
const partnerRoutes = require("./routes/partnerRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const productRoutes = require("./routes/productRoutes");
const contactRoutes = require("./routes/contactRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const partnershipRoutes = require("./routes/partnershipRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const chargerlocationRoutes = require("./routes/chargerlocationRoutes");
const faqRoutes = require("./routes/faqRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();

const cors = require("cors");
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
// app.use(compression());

app.use("/test", (req, res) => res.send("<h1>This is a test API</h1>"));
app.use("/api/auth", authRoutes);
app.use("/api/testimonial", testimonialRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/partner", partnerRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/partnership", partnershipRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/chargerlocation", chargerlocationRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/blog", blogRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
