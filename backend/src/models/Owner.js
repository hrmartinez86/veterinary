const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Owner', {
  id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:    { type: DataTypes.STRING,  allowNull: false },
  email:   { type: DataTypes.STRING,  allowNull: false, unique: true },
  phone:   { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
}, { tableName: 'owners', timestamps: true });
