const Livro = require('../models/Livro');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.listarLivros = catchAsync(async (req, res) => {
    const livros = await Livro.find();
    res.status(200).json({
        status: 'success',
        results: livros.length,
        data: { livros }
    });
});

exports.criarLivro = catchAsync(async (req, res) => {
    const livro = await Livro.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { livro }
    });
});

exports.getLivro = catchAsync(async (req, res) => {
    const livro = await Livro.findById(req.params.id);
    if (!livro) throw new AppError('Livro não encontrado', 404);
    
    res.status(200).json({
        status: 'success',
        data: { livro }
    });
});

exports.atualizarLivro = catchAsync(async (req, res) => {
    const livro = await Livro.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!livro) throw new AppError('Livro não encontrado', 404);
    
    res.status(200).json({
        status: 'success',
        data: { livro }
    });
});

exports.deletarLivro = catchAsync(async (req, res) => {
    const livro = await Livro.findByIdAndDelete(req.params.id);
    if (!livro) throw new AppError('Livro não encontrado', 404);

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.buscarLivro = catchAsync(async (req, res) => {
    const { titulo, autor, isbn } = req.query;
    const filtro = {
        ...(titulo && { titulo: { $regex: titulo, $options: 'i' } }),
        ...(autor && { autor: { $regex: autor, $options: 'i' } }),
        ...(isbn && { isbn })
    };

    const livros = await Livro.find(filtro);
    res.status(200).json({
        status: 'success',
        results: livros.length,
        data: { livros }
    });
});

exports.avaliarLivro = catchAsync(async (req, res) => {
    const { livroId, avaliacao } = req.body;

    const livro = await Livro.findById(livroId);
    if (!livro) throw new AppError('Livro não encontrado', 404);

    livro.avaliacoes.push(avaliacao);
    await livro.save();

    res.status(200).json({
        status: 'success',
        data: { livro }
    });
});
