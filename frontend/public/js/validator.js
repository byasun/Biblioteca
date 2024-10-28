function validarFormularioUsuario() {
    const campos = {
        nome: document.getElementById('nome').value,
        matricula: document.getElementById('matricula').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
    };

    return validarCampos(campos);
}

function validarFormularioLivro() {
    const campos = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        genero: document.getElementById('genero').value,
        anoPublicacao: document.getElementById('anoPublicacao').value,
    };

    return validarCampos(campos, true);
}

function validarCampos(campos, validarAno = false) {
    for (const campo in campos) {
        if (!campos[campo]) {
            alert(`O campo ${campo} é obrigatório!`);
            return false;
        }
    }

    if (validarAno) {
        const anoPublicacao = campos.anoPublicacao;
        if (isNaN(anoPublicacao) || anoPublicacao < 0) {
            alert('Insira um ano de publicação válido!');
            return false;
        }
    }

    // Validação de email simples
    if (campos.email) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(campos.email)) {
            alert('Insira um email válido!');
            return false;
        }
    }

    return true;
}
