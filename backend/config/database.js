const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
        try {
            await mongoose.connect(config.mongoUri, {
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
