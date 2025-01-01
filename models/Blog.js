module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define("Blog", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Title is required." },
        notEmpty: { msg: "Title cannot be empty." },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.BLOB("long"), // For storing image as a buffer
      allowNull: false,
      validate: {
        notNull: { msg: "Image is required." },
      },
    },
    contentType: {
      type: DataTypes.STRING, // MIME type of the image
      allowNull: false,
      validate: {
        notNull: { msg: "Content type is required." },
      },
    },
    customOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return Blog;
};
