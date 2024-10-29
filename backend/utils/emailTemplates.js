const templates = {
    confirmacaoEmprestimo: {
        subject: dados => `Confirmação de Empréstimo - ${dados.livro}`,
        html: dados => `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333; text-align: center;">Confirmação de Empréstimo</h1>
                <p>Olá ${dados.nomeUsuario},</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                    <p>Seu empréstimo foi realizado com sucesso!</p>
                    <p><strong>Livro:</strong> ${dados.livro}</p>
                    <p><strong>Data do empréstimo:</strong> ${dados.dataEmprestimo}</p>
                    <p><strong>Data prevista para devolução:</strong> ${dados.dataDevolucao}</p>
                </div>
                <p style="margin-top: 20px;">Obrigado por utilizar nossos serviços!</p>
                <div style="text-align: center; margin-top: 30px; color: #666;">
                    <small>Este é um email automático, por favor não responda.</small>
                </div>
            </div>
        `
    },
    
    lembreteDevoluçao: {
        subject: dados => `Lembrete de Devolução - ${dados.livro}`,
        html: dados => `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333; text-align: center;">Lembrete de Devolução</h1>
                <p>Olá ${dados.nomeUsuario},</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                    <p>Gostaríamos de lembrar que o prazo para devolução do livro "${dados.livro}" está próximo.</p>
                    <p><strong>Data prevista para devolução:</strong> ${dados.dataDevolucao}</p>
                    <p>Por favor, devolva o livro até a data prevista para evitar multas.</p>
                </div>
                <p style="margin-top: 20px;">Obrigado pela sua atenção!</p>
                <div style="text-align: center; margin-top: 30px; color: #666;">
                    <small>Este é um email automático, por favor não responda.</small>
                </div>
            </div>
        `
    }
};

module.exports = {
    getSubject: (template, dados) => templates[template].subject(dados),
    getHtml: (template, dados) => templates[template].html(dados)
};