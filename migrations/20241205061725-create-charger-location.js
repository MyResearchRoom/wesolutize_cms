"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Chargerlocations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      chargingStation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      chargerType: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      googleMapLink: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.BLOB("long"),
        allowNull: false,
      },
      contentType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Chargerlocations");
  },
};
