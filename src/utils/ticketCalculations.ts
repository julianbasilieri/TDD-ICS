export const calcularPrecioPorTicket = (type: string): number => {
    return type === 'vip' ? 25000 : 15000;
};

export const calcularTotal = (ticketCount: number, ticketType: string): number => {
    if (ticketCount <= 0) return 0
    return calcularPrecioPorTicket(ticketType) * ticketCount;
};
