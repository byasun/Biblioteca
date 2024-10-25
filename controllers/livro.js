const Livro = require('./models/livro');

exports.createLivro = async (req, res) => {
    const { titulo, autor, genero, anoPublicacao } = req.body;
    const novoLivro = new Livro({ titulo, autor, genero, anoPublicacao });
    try {
        await novoLivro.save();
        res.status(201).json(novoLivro);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getLivros = async (req, res) => {
    try {
        const livros = await Livro.find();
        res.status(200).json(livros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
