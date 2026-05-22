const { Owner, Pet } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { name:  { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }
    const owners = await Owner.findAll({ where, include: [{ model: Pet, as: 'pets', attributes: ['id','name','species'] }], order: [['name','ASC']] });
    res.json(owners);
  } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
  try {
    const owner = await Owner.findByPk(req.params.id, {
      include: [{ model: Pet, as: 'pets' }],
    });
    if (!owner) return res.status(404).json({ error: 'Dueño no encontrado' });
    res.json(owner);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name y email son requeridos' });
    const owner = await Owner.create({ name, email, phone, address });
    res.status(201).json(owner);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError')
      return res.status(400).json({ error: 'El email ya está registrado' });
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const owner = await Owner.findByPk(req.params.id);
    if (!owner) return res.status(404).json({ error: 'Dueño no encontrado' });
    await owner.update(req.body);
    res.json(owner);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const owner = await Owner.findByPk(req.params.id);
    if (!owner) return res.status(404).json({ error: 'Dueño no encontrado' });
    await owner.destroy();
    res.json({ message: 'Eliminado' });
  } catch (e) { next(e); }
};
