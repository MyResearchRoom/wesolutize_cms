module.exports = (sequelize, DataTypes) => {
  const Chargerlocation = sequelize.define("Chargerlocation", {
    chargingStation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chargerType: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    googleMapLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
    contentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return Chargerlocation;
};
