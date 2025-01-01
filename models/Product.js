module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Title is required." },
        notEmpty: { msg: "Title cannot be empty." },
      },
    },
    subTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: " Sub title is required." },
        notEmpty: { msg: "Sub title cannot be empty." },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "Description is required." },
        notEmpty: { msg: "Description cannot be empty." },
      },
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
    brochure: {
      type: DataTypes.BLOB("long"), // For storing image as a buffer
      allowNull: true,
    },
    customOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  Product.associate = (models) => {
    Product.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return Product;
};
