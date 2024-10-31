class UsuarioService {
    static async cadastrar(dadosUsuario) {
        try {
            const response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosUsuario)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro no cadastro:', error);
            throw error;
        }
    }
}