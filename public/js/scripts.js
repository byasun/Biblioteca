// URL base da API
const BASE_API_URL = 'https://biblioteca-regap-7049125ed8fd.herokuapp.com/api/v1';

document.addEventListener('DOMContentLoaded', function () {
    const formularioUsuario = document.getElementById('formUsuario');
    const formularioLivro = document.getElementById('formLivro');
    const formularioEmprestimo = document.getElementById('formEmprestimo');

    // Função genérica para enviar formulários
    async function enviarFormulario(formulario, serviceMethod) {
        const formData = new FormData(formulario);
        const data = Object.fromEntries(formData.entries());

        try {
            const result = await serviceMethod(data);
            alert(`Cadastro realizado com sucesso: ${result.data.nome || result.data.titulo || 'Empréstimo registrado'}`);
            formulario.reset();
        } catch (error) {
            console.error(`Erro ao cadastrar: ${error.message}`);
            alert(`Erro ao cadastrar: ${error.message}`);
        }
    }

    // Evento de envio do formulário de usuário
    if (formularioUsuario) {
        formularioUsuario.addEventListener('submit', function (e) {
            e.preventDefault();
            enviarFormulario(formularioUsuario, UsuarioService.cadastrar);
        });
    }

    // Evento de envio do formulário de livro
    if (formularioLivro) {
        formularioLivro.addEventListener('submit', function (e) {
            e.preventDefault();
            enviarFormulario(formularioLivro, LivroService.cadastrar);
        });
    }

    // Evento de envio do formulário de empréstimo
    if (formularioEmprestimo) {
        formularioEmprestimo.addEventListener('submit', function (e) {
            e.preventDefault();
            enviarFormulario(formularioEmprestimo, EmprestimoService.registrar);
        });
    }

    // Evento de clique nos botões de menu
    const menuBotoes = document.querySelectorAll('.menu-botao');
    menuBotoes.forEach(botao => {
        botao.addEventListener('click', function () {
            const url = this.getAttribute('data-url');
            window.location.href = url;
        });
    });
});
