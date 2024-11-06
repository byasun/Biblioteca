const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    let attempts = 0;
    const maxAttempts = 5;
    const mongoUri = process.env.AZURE_COSMOS_CONNECTIONSTRING;

    while (attempts < maxAttempts) {
        try {
            await mongoose.connect(mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            });
            console.log('Conectado ao Azure Cosmos DB com sucesso');
            break;
        } catch (error) {
            console.error(`Erro ao conectar ao Azure Cosmos DB: ${error}`);
            attempts++;
            if (attempts >= maxAttempts) {
                console.error('Máximo de tentativas alcançado. Não foi possível conectar ao banco de dados.');
                process.exit(1);
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

module.exports = connectDB;
