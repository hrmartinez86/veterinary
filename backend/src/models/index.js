const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false,
});

// ── Models ──────────────────────────────────────────────────────────
const Owner = require('./Owner')(sequelize);
const Pet   = require('./Pet')(sequelize);
const Vaccine = require('./Vaccine')(sequelize);
const Consultation = require('./Consultation')(sequelize);

// ── Associations ─────────────────────────────────────────────────────
Owner.hasMany(Pet,   { foreignKey: 'ownerId', as: 'pets' });
Pet.belongsTo(Owner, { foreignKey: 'ownerId', as: 'owner' });

Pet.hasMany(Vaccine,      { foreignKey: 'petId', as: 'vaccines' });
Vaccine.belongsTo(Pet,    { foreignKey: 'petId', as: 'pet' });

Pet.hasMany(Consultation,      { foreignKey: 'petId', as: 'consultations' });
Consultation.belongsTo(Pet,    { foreignKey: 'petId', as: 'pet' });

module.exports = { sequelize, Owner, Pet, Vaccine, Consultation };
