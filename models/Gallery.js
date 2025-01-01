module.exports = (sequelize, DataTypes) => {
  const Gallery = sequelize.define("Gallery", {
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
    type: {
      type: DataTypes.ENUM("franchise", "team"),
      allowNull: false,
    },
  });

  Gallery.associate = (models) => {
    Gallery.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return Gallery;
};
