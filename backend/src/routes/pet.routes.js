const router  = require('express').Router();
const multer  = require('multer');
const path    = require('path');
const { v4: uuidv4 } = require('uuid');
const fs      = require('fs');
const c       = require('../controllers/pet.controller');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename:    (_, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname).toLowerCase()}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Solo imágenes jpg/png/webp'));
  },
});

router.get('/',            c.list);
router.get('/:id',         c.get);
router.post('/',           upload.single('photo'), c.create);
router.put('/:id',         upload.single('photo'), c.update);
router.delete('/:id',      c.remove);

module.exports = router;
