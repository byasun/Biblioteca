const Emprestimo = require('../models/Emprestimo');
const Livro = require('../models/Livro');
const Usuario = require('../models/Usuario');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { enviarEmailConfirmacao } = require('../utils/email');

exports.realizarEmprestimo = catchAsync(async (req, res) => {
    const { livroId } = req.body;
    const usuarioId = req.user.id;

    // Verifica se o usuário pode realizar empréstimos
    const usuario = await Usuario.findById(usuarioId).populate('emprestimosAtivos');
    if (!usuario.podeEmprestar()) {
        throw new AppError('Usuário atingiu o limite de empréstimos ou está inativo', 400);
    }

    // Verifica se o livro está disponível
    const livro = await Livro.findById(livroId);
    if (!livro || !livro.estaDisponivel()) {
        throw new AppError('Livro não disponível para empréstimo', 400);
    }

    // Calcula data de devolução (15 dias a partir de hoje)
    const dataDevolucaoPrevista = new Date();
    dataDevolucaoPrevista.setDate(dataDevolucaoPrevista.getDate() + 15);

    const emprestimo = await Emprestimo.create({
        usuario: usuarioId,
        livro: livroId,
        dataDevolucaoPrevista
    });

    // Atualiza referências
    usuario.emprestimosAtivos.push(emprestimo._id);
    await usuario.save();

    // Envia email de confirmação
    await enviarEmailConfirmacao(usuario.email, {
        livro: livro.titulo,
        dataEmprestimo: emprestimo.dataEmprestimo,
        dataDevolucao: emprestimo.dataDevolucaoPrevista
    });

    res.status(201).json({
        status: 'success',
        data: {
            emprestimo: await emprestimo.populate(['livro', 'usuario'])
        }
    });
});

exports.realizarDevolucao = catchAsync(async (req, res) => {
    const { emprestimoId } = req.params;

    const emprestimo = await Emprestimo.findById(emprestimoId);
    if (!emprestimo) {
        throw new AppError('Empréstimo não encontrado', 404);
    }

    if (emprestimo.status === 'DEVOLVIDO') {
        throw new AppError('Este livro já foi devolvido', 400);
    }

    await emprestimo.devolver();

    // Remove o empréstimo da lista de empréstimos ativos do usuário
    await Usuario.findByIdAndUpdate(emprestimo.usuario, {
        $pull: { emprestimosAtivos: emprestimoId }
    });

    res.status(200).json({
        status: 'success',
        data: {
            emprestimo
        }
    });
});

exports.renovarEmprestimo = catchAsync(async (req, res) => {
    const { emprestimoId } = req.params;

    const emprestimo = await Emprestimo.findById(emprestimoId);
    if (!emprestimo) {
        throw new AppError('Empréstimo não encontrado', 404);
    }

    if (emprestimo.status !== 'ATIVO') {
        throw new AppError('Apenas empréstimos ativos podem ser renovados', 400);
    }

    if (emprestimo.estaAtrasado()) {
        throw new AppError('Não é possível renovar um empréstimo atrasado', 400);
    }

    await emprestimo.renovar(15); // Renova por mais 15 dias

    res.status(200).json({
        status: 'success',
        data: {
            emprestimo
        }
    });
});

exports.listarEmprestimos = catchAsync(async (req, res) => {
    const { status, usuario, livro } = req.query;
    const filtro = {};

    if (status) filtro.status = status;
    if (usuario) filtro.usuario = usuario;
    if (livro) filtro.livro = livro;

    const emprestimos = await Emprestimo.find(filtro)
        .populate('usuario', 'nome email matricula')
        .populate('livro', 'titulo autor isbn');

    res.status(200).json({
        status: 'success',
        results: emprestimos.length,
        data: {
            emprestimos
        }
    });
});

exports.getEmprestimo = catchAsync(async (req, res) => {
    const emprestimo = await Emprestimo.findById(req.params.id)
        .populate('usuario', 'nome email matricula')
        .populate('livro', 'titulo autor isbn');

    if (!emprestimo) {
        throw new AppError('Empréstimo não encontrado', 404);
    }

    res.status(200).json({
        status: 'success',
        data: {
            emprestimo
        }
    });
});

exports.listarEmprestimosAtrasados = catchAsync(async (req, res) => {
    const emprestimosAtrasados = await Emprestimo.findAtrasados();

    res.status(200).json({
        status: 'success',
        results: emprestimosAtrasados.length,
        data: {
            emprestimos: emprestimosAtrasados
        }
    });
});

exports.pagarMulta = catchAsync(async (req, res) => {
    const { emprestimoId } = req.params;

    const emprestimo = await Emprestimo.findById(emprestimoId);
    if (!emprestimo) {
        throw new AppError('Empréstimo não encontrado', 404);
    }

    if (!emprestimo.multa.valor || emprestimo.multa.paga) {
        throw new AppError('Não há multa pendente para este empréstimo', 400);
    }

    emprestimo.multa.paga = true;
    await emprestimo.save();

    res.status(200).json({
        status: 'success',
        data: {
            emprestimo
        }
    });
});

exports.relatorioEmprestimos = catchAsync(async (req, res) => {
    const { dataInicio, dataFim } = req.query;

    const filtro = {};
    if (dataInicio || dataFim) {
        filtro.dataEmprestimo = {};
        if (dataInicio) filtro.dataEmprestimo.$gte = new Date(dataInicio);
        if (dataFim) filtro.dataEmprestimo.$lte = new Date(dataFim);
    }

    const emprestimos = await Emprestimo.find(filtro)
        .populate('usuario', 'nome matricula')
        .populate('livro', 'titulo autor');

    const estatisticas = {
        total: emprestimos.length,
        ativos: emprestimos.filter(e => e.status === 'ATIVO').length,
        devolvidos: emprestimos.filter(e => e.status === 'DEVOLVIDO').length,
        atrasados: emprestimos.filter(e => e.status === 'ATRASADO').length,
        multasTotal: emprestimos. reduce((acc, e) => acc + (e.multa.valor || 0), 0)
    };

    res.status(200).json({
        status: 'success',
        data: {
            estatisticas,
            emprestimos
        }
    });
});