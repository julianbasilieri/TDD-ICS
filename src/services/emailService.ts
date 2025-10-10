import emailjs from '@emailjs/browser';

const ENV = import.meta.env

interface EmailData {
    email: string;
    transactionId: string;
    visitDate: string;
    ticketCount: number;
    ticketType: string;
    paymentMethod: string;
    totalAmount: number;
    reservationCode?: string;
}

export const emailService = {
    sendPurchaseConfirmation: async (data: EmailData) => {
        try {
            // Validación de variables de entorno
            if (
                !ENV.VITE_EMAILJS_SERVICE_ID ||
                !ENV.VITE_EMAILJS_TEMPLATE_ID_BOLETERIA ||
                !ENV.VITE_EMAILJS_TEMPLATE_ID_MERCADOPAGO ||
                !ENV.VITE_EMAILJS_PUBLIC_KEY
            ) {
                console.error('Faltan variables de entorno para EmailJS');
            }

            // Parámetros base comunes
            const baseParams = {
                email: data.email,
                visitDate: new Date(data.visitDate).toLocaleDateString(),
                ticketCount: data.ticketCount,
                ticketType: data.ticketType.toUpperCase(),
                totalAmount: data.totalAmount.toLocaleString(),
            };

            // Selección del template y parámetros específicos
            let templateParams;
            let selectedTemplate;
            if (data.paymentMethod === 'cash') {
                templateParams = {
                    ...baseParams,
                    reservationCode: data.reservationCode,
                };
                selectedTemplate = ENV.VITE_EMAILJS_TEMPLATE_ID_BOLETERIA;
            } else {
                templateParams = {
                    ...baseParams,
                    transactionId: data.transactionId,
                    paymentMethod: 'Tarjeta de crédito',
                };
                selectedTemplate = ENV.VITE_EMAILJS_TEMPLATE_ID_MERCADOPAGO;
            }

            // Envío del correo
            await emailjs.send(
                ENV.VITE_EMAILJS_SERVICE_ID,
                selectedTemplate,
                templateParams,
                ENV.VITE_EMAILJS_PUBLIC_KEY
            );

            return { success: true };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }
    }
};
