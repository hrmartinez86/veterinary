require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const { sequelize } = require('./models');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/owners',       require('./routes/owner.routes'));
app.use('/api/pets',         require('./routes/pet.routes'));
app.use('/api/pets/:petId/vaccines',      require('./routes/vaccine.routes'));
app.use('/api/pets/:petId/consultations', require('./routes/consultation.routes'));

// Error handler
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Error interno' });
});

const PORT = process.env.PORT || 4001;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Veterinaria API → http://localhost:${PORT}`));
});
