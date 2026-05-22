const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Consultation', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  petId:       { type: DataTypes.INTEGER, allowNull: false },
  type:        {
    type: DataTypes.ENUM('consultation', 'grooming', 'vaccine', 'surgery', 'emergency', 'checkup'),
    defaultValue: 'consultation',
  },
  title:       { type: DataTypes.STRING,  allowNull: false },
  description: { type: DataTypes.TEXT },
  diagnosis:   { type: DataTypes.TEXT },
  treatment:   { type: DataTypes.TEXT },
  vet:         { type: DataTypes.STRING },                       // nombre del veterinario
  weight:      { type: DataTypes.FLOAT },                        // peso en la consulta
  temperature: { type: DataTypes.FLOAT },                        // temperatura
  date:        { type: DataTypes.DATEONLY, allowNull: false },
  attachments: {
    type: DataTypes.TEXT,
    get() {
      const v = this.getDataValue('attachments');
      return v ? JSON.parse(v) : [];
    },
    set(v) { this.setDataValue('attachments', JSON.stringify(v || [])); },
  },
}, { tableName: 'consultations', timestamps: true });
