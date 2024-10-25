const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://root:admin@teste.eauif.mongodb.net/?retryWrites=true&w=majority&appName=Teste', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexão com o MongoDB estabelecida!');
}).catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
});