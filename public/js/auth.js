// public/js/auth.js
class AuthService {
    static async login(credentials) {
        try {
            const response = await fetch('https://<seu-endpoint-azure>.azurewebsites.net/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }
}