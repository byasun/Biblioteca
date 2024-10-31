const multer = require('multer');
const path = require('path');

// Configuração do armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Certifique-se de que esta pasta existe
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Criação do middleware de upload
const upload = multer({ storage });

// Exportação do middleware
module.exports = upload;
