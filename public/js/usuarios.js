class UsuarioService {
    static async cadastrar(dadosUsuario) {
        try {
            const response = await fetch('https://biblioteca-regap-7049125ed8fd.herokuapp.com/api/v1/auth/registro', { // URL corrigida da API
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosUsuario)
            });

            // Verifique se a resposta não está OK
            if (!response.ok) {
                // Obtém a resposta como texto para investigar o erro
                const errorText = await response.text();
                console.error('Erro no cadastro:', errorText);
                throw new Error('Erro ao cadastrar usuário');
            }

            // Retorna a resposta JSON se o cadastro for bem-sucedido
            return await response.json();
        } catch (error) {
            console.error('Erro no processo de cadastro:', error);
            throw error;
        }
    }
}
