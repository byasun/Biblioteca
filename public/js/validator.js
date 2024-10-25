function validarFormularioUsuario() {
    const nome = document.getElementById('nome').value;
    const matricula = document.getElementById('matricula').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;

    if (!nome || !matricula || !email || !telefone) {
        alert('Todos os campos são obrigatórios!');
        return false;
    }

    // Validação de email simples
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        alert('Insira um email válido!');
        return false;
    }

    return true;
}

function validarFormularioLivro() {
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const genero = document.getElementById('genero').value;
    const anoPublicacao = document.getElementById('anoPublicacao').value;

    if (!titulo || !autor || !genero || !anoPublicacao) {
        alert('Todos os campos são obrigatórios!');
        return false;
    }

    // Validação do ano de publicação
    if (isNaN(anoPublicacao) || anoPublicacao < 0) {
        alert('Insira um ano de publicação válido!');
        return false;
    }

    return true;
}
