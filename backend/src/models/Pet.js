const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Pet', {
  id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  name:    { type: DataTypes.STRING,  allowNull: false },
  species: { type: DataTypes.ENUM('dog', 'cat', 'bird', 'rabbit', 'other'), defaultValue: 'dog' },
  breed:   { type: DataTypes.STRING },
  age:     { type: DataTypes.FLOAT },          // años
  weight:  { type: DataTypes.FLOAT },          // kg
  sex:     { type: DataTypes.ENUM('male', 'female'), defaultValue: 'male' },
  color:   { type: DataTypes.STRING },
  photo:   { type: DataTypes.STRING },
  notes:   { type: DataTypes.TEXT },
}, { tableName: 'pets', timestamps: true });
