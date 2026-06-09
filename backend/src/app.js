require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const { sequelize } = require('./models');
const authController = require('./controllers/auth.controller');
const authenticate = require('./middlewares/auth.middleware');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', authenticate, require('./routes/user.routes'));
app.use('/api/owners', authenticate, require('./routes/owner.routes'));
app.use('/api/pets', authenticate, require('./routes/pet.routes'));
app.use('/api/pets/:petId/vaccines', authenticate, require('./routes/vaccine.routes'));
app.use('/api/pets/:petId/consultations', authenticate, require('./routes/consultation.routes'));

// Error handler
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Error interno' });
});

const PORT = process.env.PORT || 4001;

async function start() {
  await sequelize.sync({ alter: true });
  await authController.ensureDefaultAdmin();
  app.listen(PORT, () => console.log(`Veterinaria API → http://localhost:${PORT}`));
}

start().catch(error => {
  console.error(error);
  process.exit(1);
});
