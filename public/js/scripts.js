document.addEventListener('DOMContentLoaded', function () {
    const formularioUsuario = document.getElementById('formUsuario');
    const formularioLivro = document.getElementById('formLivro');

    // Função genérica para enviar formulário
    async function enviarFormulario(formulario, url) {
        const formData = new FormData(formulario);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`https://biblioteca-regap-7049125ed8fd.herokuapp.com${url}`, { // URL completa da API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Erro na resposta do servidor');

            const result = await response.json();
            alert(`Cadastro realizado com sucesso: ${result.data.nome || result.data.titulo}`);
            formulario.reset(); // Reseta o formulário após o envio
        } catch (error) {
            console.error(`Erro ao cadastrar: ${error.message}`);
            alert(`Erro ao cadastrar: ${error.message}`);
        }
    }

    // Evento de envio do formulário de usuário
    if (formularioUsuario) {
        formularioUsuario.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validarFormularioUsuario()) return; // Chama a validação
            enviarFormulario(formularioUsuario, '/api/v1/usuarios/registrar'); // URL completa da rota de cadastro
        });
    }

    // Evento de envio do formulário de livro
    if (formularioLivro) {
        formularioLivro.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validarFormularioLivro()) return; // Chama a validação
            enviarFormulario(formularioLivro, '/api/v1/livros'); // URL completa da rota de livros
        });
    }

    // Evento de clique nos botões de menu
    const menuBotoes = document.querySelectorAll('.menu-botao');
    menuBotoes.forEach(botao => {
        botao.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            window.location.href = url;
        });
    });
});
