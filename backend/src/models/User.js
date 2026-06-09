const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('User', {
  id:                 { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:               { type: DataTypes.STRING, allowNull: false },
  email:              { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash:       { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
  role:               { type: DataTypes.STRING, allowNull: false, defaultValue: 'staff' },
  mustChangePassword: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
  tableName: 'users',
  timestamps: true,
});