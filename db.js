require('dotenv').config(); // Carrega as variáveis de ambiente do .env
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI; // Agora ele vai pegar a URI do .env

if (!uri) {
    console.error('A variável de ambiente MONGODB_URI não está definida.');
    process.exit(1); // Encerra o processo se a URI não estiver definida
}

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false, // Evita depreciações
    useCreateIndex: true, // Para criar índices automaticamente
})
.then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
})
.catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1); // Encerra o processo se a conexão falhar
});

module.exports = mongoose;
