document.addEventListener('DOMContentLoaded', function () {
    const formularioUsuario = document.getElementById('formUsuario');
    const formularioLivro = document.getElementById('formLivro');

    // Evento de envio do formulário de usuário
    if (formularioUsuario) {
        formularioUsuario.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (!validarFormularioUsuario()) return; // Chama a validação

            const formData = new FormData(formularioUsuario);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/usuarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) throw new Error('Erro na resposta do servidor');

                const result = await response.json();
                alert('Usuário cadastrado com sucesso: ' + result.nome);
                formularioUsuario.reset(); // Reseta o formulário após o envio
            } catch (error) {
                console.error('Erro ao cadastrar usuário:', error);
                alert('Erro ao cadastrar usuário: ' + error.message);
            }
        });
    }

    // Evento de envio do formulário de livro
    if (formularioLivro) {
        formularioLivro.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (!validarFormularioLivro()) return; // Chama a validação

            const formData = new FormData(formularioLivro);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/livros', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) throw new Error('Erro na resposta do servidor');

                const result = await response.json();
                alert('Livro cadastrado com sucesso: ' + result.titulo);
                formularioLivro.reset(); // Reseta o formulário após o envio
            } catch (error) {
                console.error('Erro ao cadastrar livro:', error);
                alert('Erro ao cadastrar livro: ' + error.message);
            }
        });
    }
});
