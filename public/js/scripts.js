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
            if (result.status === 'success') {
                alert(`Cadastro realizado com sucesso: ${result.data.nome || result.data.titulo || 'Empréstimo registrado'}`);
                formulario.reset();
                window.location.href = 'index.html'; // Redireciona para a página principal
            } else {
                alert(`Erro: ${result.message || 'Ocorreu um erro no cadastro'}`);
            }
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

let currentIndex = 0;
const images = document.querySelectorAll('.carousel-image');
const totalImages = images.length;

function showNextImage() {
    images[currentIndex].style.display = 'none'; // Oculta a imagem atual
    currentIndex = (currentIndex + 1) % totalImages; // Atualiza o índice
    images[currentIndex].style.display = 'block'; // Exibe a próxima imagem
}

function showPreviousImage() {
    images[currentIndex].style.display = 'none'; // Oculta a imagem atual
    currentIndex = (currentIndex - 1 + totalImages) % totalImages; // Atualiza o índice
    images[currentIndex].style.display = 'block'; // Exibe a imagem anterior
}

// Inicializa a galeria
images.forEach((img, index) => {
    img.style.display = index === 0 ? 'block' : 'none'; // Mostra apenas a primeira imagem
});

// Função para alternar o menu
function toggleMenu() {
    const menu = document.getElementById("menu-dropdown");
    menu.classList.toggle("show");
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleSlider = document.getElementById('toggleSlider');
    const toggleLabel = document.getElementById('toggleLabel'); // Para o texto da barra de navegação
    const textPegar = document.getElementById('textPegar');
    const textDevolver = document.getElementById('textDevolver');

    toggleSlider.addEventListener('click', () => {
        toggleSlider.classList.toggle('checked');

        // Verifica o estado do toggle e altera o texto correspondente
        if (toggleSlider.classList.contains('checked')) {
            toggleLabel.textContent = "Devolver Livro"; // Altera o texto na barra de navegação
            textPegar.style.display = 'none'; // Oculta o texto "Pegar"
            textDevolver.style.display = 'block'; // Mostra o texto "Devolver"
        } else {
            toggleLabel.textContent = "Pegar Livro"; // Altera o texto na barra de navegação
            textPegar.style.display = 'block'; // Mostra o texto "Pegar"
            textDevolver.style.display = 'none'; // Oculta o texto "Devolver"
        }
    });
});
