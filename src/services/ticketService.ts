interface TicketAvailability {
    [date: string]: number;
}

export const ticketService = {
    initializeAvailability: () => {
        if (!localStorage.getItem('ticketAvailability')) {

            const availability: TicketAvailability = {};
            const today = new Date();

            // Generar fechas para las próximas 4 semanas
            for (let i = 0; i < 28; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const day = date.getDay();

                // Solo viernes (4), sábado (5) y domingo (6)
                if ([5, 6, 0].includes(day)) {
                    const dateStr = date.toISOString().split('T')[0];
                    availability[dateStr] = 5;
                }
            }

            localStorage.setItem('ticketAvailability', JSON.stringify(availability));
            return availability;
        }
    },

    getAvailability: (date: string) => {
        const availability = JSON.parse(localStorage.getItem('ticketAvailability') || '{}');
        return availability[date] || 0;
    },

    getAvaibilityDays: () => {
        return localStorage.getItem('ticketAvailability')
    },

    updateAvailability: (date: string, quantity: number) => {
        const availability = JSON.parse(localStorage.getItem('ticketAvailability') || '{}');
        if (availability[date] >= quantity) {
            availability[date] -= quantity;
            localStorage.setItem('ticketAvailability', JSON.stringify(availability));
            return true;
        }
        return false;
    }
};
