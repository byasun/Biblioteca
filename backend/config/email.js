const nodemailer = require('nodemailer');
const config = require('./config');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.emailConfig.host,
            port: config.emailConfig.port,
            secure: config.emailConfig.secure || false,
            auth: {
                user: config.emailConfig.user,
                pass: config.emailConfig.pass,
            },
            pool: true, // Use pooled connections
            maxConnections: 5, // Maximum number of connections to make
            maxMessages: 100, // Maximum number of messages to send using a connection
            rateDelta: 1000, // How many milliseconds between message sends
            rateLimit: 5, // Maximum number of messages per rateDelta
        });

        this.emailQueue = [];
        this.isProcessingQueue = false;
        this.retryAttempts = 3;
        this.retryDelay = 5000; // 5 segundos
    }

    // Templates de email
    get emailTemplates() {
        return {
            confirmacaoEmprestimo: (dados) => ({
                subject: 'Confirmação de Empréstimo',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h1>Confirmação de Empréstimo</h1>
                        <p>Olá ${dados.nomeUsuario},</p>
                        <p>Seu empréstimo do livro "${dados.livro}" foi realizado com sucesso.</p>
                        <p>Detalhes do empréstimo:</p>
                        <ul>
                            <li>Data do empréstimo: ${dados.dataEmprestimo}</li>
                            <li>Data prevista para devolução: ${dados.dataDevolucao}</li>
                        </ul>
                        <p>Obrigado por utilizar nossa biblioteca!</p>
                    </div>
                `
            }),
            lembreteDevoluacao: (dados) => ({
                subject: 'Lembrete de Devolução',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h1>Lembrete de Devolução</h1>
                        <p>Olá ${dados.nomeUsuario},</p>
                        <p>O prazo de devolução do livro "${dados.livro}" está próximo.</p>
                        <p>Data prevista para devolução: ${dados.dataDevolucao}</p>
                        <p>Por favor, providencie a devolução para evitar multas.</p>
                    </div>
                `
            }),
            recuperacaoSenha: (dados) => ({
                subject: 'Recuperação de Senha',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h1>Recuperação de Senha</h1>
                        <p>Olá ${dados.nomeUsuario},</p>
                        <p>Foi solicitada a recuperação de senha para sua conta.</p>
                        <p>Clique no link abaixo para redefinir sua senha:</p>
                        <a href="${dados.resetLink}">Redefinir Senha</a>
                        <p>Este link é válido por 1 hora.</p>
                        <p>Se você não solicitou esta recuperação, ignore este email.</p>
                    </div>
                `
            })
        };
    }

    // Adiciona email à fila
    async queueEmail(to, templateName, dados) {
        const template = this.emailTemplates[templateName](dados);
        const emailData = {
            to,
            subject: template.subject,
            html: template.html,
            attempts: 0
        };

        this.emailQueue.push(emailData);
        console.log(`Email adicionado à fila para: ${to}`);

        if (!this.isProcessingQueue) {
            this.processQueue();
        }
    }

    // Processa a fila de emails
    async processQueue() {
        if (this.isProcessingQueue || this.emailQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;

        while (this.emailQueue.length > 0) {
            const emailData = this.emailQueue[0];
            
            try {
                await this.sendEmail(emailData);
                this.emailQueue.shift(); // Remove o email da fila após envio bem-sucedido
                console.log(`Email enviado com sucesso para: ${emailData.to}`);
            } catch (error) {
                console.error(`Erro ao enviar email para ${emailData.to}:`, error);
                
                if (emailData.attempts < this.retryAttempts) {
                    emailData.attempts++;
                    console.log(`Tentativa ${emailData.attempts} de ${this.retryAttempts} para ${emailData.to}`);
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                } else {
                    console.error(`Falha ao enviar email para ${emailData.to} após ${this.retryAttempts} tentativas`);
                    this.emailQueue.shift(); // Remove o email da fila após tentativas máximas
                }
            }
        }

        this.isProcessingQueue = false;
    }

    // Envia o email
    async sendEmail(emailData) {
        const mailOptions = {
            from: `"Biblioteca" <${config.emailConfig.user}>`,
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            this.logEmailSuccess(emailData.to, info.messageId);
            return info;
        } catch (error) {
            this.logEmailError(emailData.to, error);
            throw error;
        }
    }

    // Logs
    logEmailSuccess(to, messageId) {
        console.log({
            level: 'info',
            message: 'Email enviado com sucesso',
            timestamp: new Date(),
            to,
            messageId
        });
    }

    logEmailError(to, error) {
        console.error({
            level: 'error',
            message: 'Erro ao enviar email',
            timestamp: new Date(),
            to,
            error: error.message
        });
    }

    // Verifica status do serviço de email
    async checkEmailService() {
        try {
            await this.transporter.verify();
            return { status: 'ok', message: 'Serviço de email funcionando normalmente' };
        } catch (error) {
            return { status: 'error', message: 'Problema com serviço de email', error: error.message };
        }
    }
}

module.exports = new EmailService();