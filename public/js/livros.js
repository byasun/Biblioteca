// Base URL para API
const BASE_API_URL = 'https://biblioteca-regap.azurewebsites.net/api/v1/usuarios/registrar';

// Classe para operações relacionadas a livros
class LivroService {
    // Método para cadastrar um livro
    static async cadastrar(dadosLivro) {
        try {
            const response = await fetch(`${BASE_API_URL}/livros`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosLivro)
            });
            if (!response.ok) throw new Error('Erro ao cadastrar livro');
            return await response.json();
        } catch (error) {
            console.error('Erro no cadastro do livro:', error);
            throw error;
        }
    }

    // Método para listar todos os livros
    static async listar() {
        try {
            const response = await fetch(`${BASE_API_URL}/livros`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Erro ao listar livros');
            return await response.json();
        } catch (error) {
            console.error('Erro ao listar livros:', error);
            throw error;
        }
    }
}
