module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define("News", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Title is required." },
        notEmpty: { msg: "Title cannot be empty." },
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "Date is required." },
        isDate: { msg: "Invalid date format." },
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "URL is required." },
        isUrl: { msg: "Invalid URL format." },
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
    customOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  News.associate = (models) => {
    News.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return News;
};
