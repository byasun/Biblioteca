document.addEventListener('DOMContentLoaded', function () {
    const formularioUsuario = document.getElementById('formUsuario');
    const formularioLivro = document.getElementById('formLivro');

    // Evento de envio do formulário de usuário
    if (formularioUsuario) {
        formularioUsuario.addEventListener('submit', async function (e) {
            e.preventDefault();
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
                const result = await response.json();
                alert('Usuário cadastrado com sucesso: ' + result.nome);
            } catch (error) {
                console.error('Erro ao cadastrar usuário:', error);
                alert('Erro ao cadastrar usuário');
            }
        });
    }

    // Evento de envio do formulário de livro
    if (formularioLivro) {
        formularioLivro.addEventListener('submit', async function (e) {
            e.preventDefault();
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
                const result = await response.json();
                alert('Livro cadastrado com sucesso: ' + result.titulo);
            } catch (error) {
                console.error('Erro ao cadastrar livro:', error);
                alert('Erro ao cadastrar livro');
            }
        });
    }
});
