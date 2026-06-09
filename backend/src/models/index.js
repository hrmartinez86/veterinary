const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;
if (process.env.DB_HOST) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
    }
  );
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'),
    logging: false,
  });
}

// ── Models ──────────────────────────────────────────────────────────
const Owner = require('./Owner')(sequelize);
const Pet   = require('./Pet')(sequelize);
const Vaccine = require('./Vaccine')(sequelize);
const Consultation = require('./Consultation')(sequelize);
const User = require('./User')(sequelize);

// ── Associations ─────────────────────────────────────────────────────
Owner.hasMany(Pet,   { foreignKey: 'ownerId', as: 'pets' });
Pet.belongsTo(Owner, { foreignKey: 'ownerId', as: 'owner' });

Pet.hasMany(Vaccine,      { foreignKey: 'petId', as: 'vaccines' });
Vaccine.belongsTo(Pet,    { foreignKey: 'petId', as: 'pet' });

Pet.hasMany(Consultation,      { foreignKey: 'petId', as: 'consultations' });
Consultation.belongsTo(Pet,    { foreignKey: 'petId', as: 'pet' });

module.exports = { sequelize, Owner, Pet, Vaccine, Consultation, User };
