require('dotenv').config(); // Carrega as variáveis de ambiente do .env
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI; // Agora ele vai pegar a URI do .env

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
})
.catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error.message);
});

module.exports = mongoose;
