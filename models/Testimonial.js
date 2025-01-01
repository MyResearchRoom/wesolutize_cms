module.exports = (sequelize, DataTypes) => {
  const Testimonial = sequelize.define("Testimonial", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: "Name must be between 2 and 50 characters.",
        },
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Rating must be an integer." },
        min: {
          args: [1],
          msg: "Rating must be between 1 and 5.",
        },
        max: {
          args: [5],
          msg: "Rating must be between 1 and 5.",
        },
      },
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Review cannot be empty." },
      },
    },
    profile: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    contentType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Testimonial.associate = (models) => {
    Testimonial.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return Testimonial;
};
