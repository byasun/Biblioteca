const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Certifique-se de que o dotenv está sendo chamado

const connectDB = async () => {
    let attempts = 0;
    const maxAttempts = 5;

    const mongoUri = process.env.MONGODB_URI;
    console.log("Mongo URI:", mongoUri);

    while (attempts < maxAttempts) {
        try {
            await mongoose.connect(mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('MongoDB conectado com sucesso!');
            return;
        } catch (error) {
            attempts++;
            console.error(`Erro ao conectar ao MongoDB (tentativa ${attempts}):`, error);
            if (attempts >= maxAttempts) {
                console.error('Número máximo de tentativas alcançado. Encerrando o processo.');
                process.exit(1);
            }
            await new Promise(res => setTimeout(res, 5000));
        }
    }
};

module.exports = connectDB;
