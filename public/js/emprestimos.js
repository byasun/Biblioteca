// Base URL para API
const BASE_API_URL = 'https://biblioteca-regap.azurewebsites.net/api/v1/usuarios/registrar';

// Classe para operações relacionadas a empréstimos
class EmprestimoService {
    // Método para registrar um novo empréstimo
    static async registrar(dadosEmprestimo) {
        try {
            const response = await fetch(`${BASE_API_URL}/emprestimos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosEmprestimo)
            });
            if (!response.ok) throw new Error('Erro ao registrar empréstimo');
            return await response.json();
        } catch (error) {
            console.error('Erro no registro do empréstimo:', error);
            throw error;
        }
    }

    // Método para listar todos os empréstimos
    static async listar() {
        try {
            const response = await fetch(`${BASE_API_URL}/emprestimos`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Erro ao listar empréstimos');
            return await response.json();
        } catch (error) {
            console.error('Erro ao listar empréstimos:', error);
            throw error;
        }
    }
}
