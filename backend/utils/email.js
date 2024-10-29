const nodemailer = require('nodemailer');
const emailTemplates = require('./emailTemplates');
const logger = require('./logger');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
            pool: true,
            maxConnections: 5
        });

        this.emailQueue = [];
        this.isProcessingQueue = false;
    }

    async enviarEmail(to, template, dados) {
        try {
            const mailOptions = {
                from: `"Biblioteca" <${process.env.EMAIL_FROM}>`,
                to,
                subject: emailTemplates.getSubject(template, dados),
                html: emailTemplates.getHtml(template, dados)
            };

            await this.transporter.sendMail(mailOptions);
            logger.info(`Email enviado com sucesso para ${to}`);
        } catch (error) {
            logger.error(`Erro ao enviar email para ${to}:`, error);
            throw new Error('Falha ao enviar email');
        }
    }

    async enviarEmailComFila(to, template, dados) {
        this.emailQueue.push({ to, template, dados });
        if (!this.isProcessingQueue) {
            this.processarFila();
        }
    }

    async processarFila() {
        if (this.isProcessingQueue || this.emailQueue.length === 0) return;

        this.isProcessingQueue = true;
        while (this.emailQueue.length > 0) {
            const { to, template, dados } = this.emailQueue[0];
            try {
                await this.enviarEmail(to, template, dados);
                this.emailQueue.shift();
            } catch (error) {
                logger.error('Erro ao processar email da fila:', error);
                // Move para o final da fila após falha
                this.emailQueue.push(this.emailQueue.shift());
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
        this.isProcessingQueue = false;
    }

    async verificarConexao() {
        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            logger.error('Erro na conexão com servidor de email:', error);
            return false;
        }
    }
}

module.exports = new EmailService();