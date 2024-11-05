class UsuarioService {
    static async cadastrar(dadosUsuario) {
        try {
            const response = await fetch('https://biblioteca-regap-7049125ed8fd.herokuapp.com/api/v1/usuarios/registrar', { // URL completa da API
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosUsuario)
            });

            if (!response.ok) throw new Error('Erro ao cadastrar usuário');

            return await response.json();
        } catch (error) {
            console.error('Erro no cadastro:', error);
            throw error;
        }
    }
}
