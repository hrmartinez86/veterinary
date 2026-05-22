const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Vaccine', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  petId:        { type: DataTypes.INTEGER, allowNull: false },
  name:         { type: DataTypes.STRING,  allowNull: false },   // nombre vacuna
  brand:        { type: DataTypes.STRING },
  lot:          { type: DataTypes.STRING },
  appliedAt:    { type: DataTypes.DATEONLY, allowNull: false },
  nextDueAt:    { type: DataTypes.DATEONLY },                    // próxima dosis
  appliedBy:    { type: DataTypes.STRING },                      // nombre del vet
  notes:        { type: DataTypes.TEXT },
}, { tableName: 'vaccines', timestamps: true });
