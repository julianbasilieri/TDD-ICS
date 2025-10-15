import { Container, Title, NumberInput, Select, Button, Stack, Text, Accordion, Grid, Paper, Modal, Group, Loader } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useState, useEffect } from 'react';
import { ticketService } from '../services/ticketService';
import { transactionService } from '../services/transactionService';
import { emailService } from '../services/emailService';
import { useForm, Controller } from 'react-hook-form';
import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { calcularPrecioPorTicket, calcularTotal } from '../utils/ticketCalculations';

interface TicketFormData {
    visitDate: string | null;
    ticketCount: number;
    visitorAges: number[];
    ticketType: string;
    paymentMethod: string;
}

export function TicketPurchasePage() {
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
    const navigate = useNavigate();

    // --- Form setup ---
    const getNextAvailableDate = () => {
        const today = new Date();
        const maxDays = 28;
        const availabilityData = JSON.parse(ticketService.getAvaibilityDays() || '{}');

        for (let i = 0; i < maxDays; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const day = date.getDay();

            if ([5, 6, 0].includes(day)) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const dayOfMonth = String(date.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${dayOfMonth}`;

                // Verificar si hay entradas disponibles para esta fecha
                if (availabilityData[dateStr] && availabilityData[dateStr] > 0) {
                    return dateStr;
                }
            }
        }
        return null;
    };

    const [availability, setAvailability] = useState<number>(0);
    const [showSuccessCash, setShowSuccessCash] = useState(false);
    const [showSuccessCredit, setShowSuccessCredit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [reservationCode, setReservationCode] = useState<string>('');

    const { control, handleSubmit, watch, formState: { errors, isValid }, setValue, reset } = useForm<TicketFormData>({
        defaultValues: {
            visitDate: getNextAvailableDate(),
            ticketCount: 1,
            visitorAges: Array(10).fill(null),
            ticketType: 'regular',
            paymentMethod: 'cash'
        },
        mode: 'onChange'
    });

    useEffect(() => {
        const defaultDate = getNextAvailableDate();
        if (defaultDate) setAvailability(ticketService.getAvailability(defaultDate));
    }, []);

    const ticketCount = watch('ticketCount');
    const ticketType = watch('ticketType');
    const paymentMethod = watch('paymentMethod');
    const validTicketCount = Math.min(Math.max(ticketCount, 1), Math.min(10, availability));

    const handleCreditCardPayment = () => window.open('https://www.mercadopago.com.ar', '_blank');

    const onSubmit = async (data: TicketFormData) => {
        if (data.visitDate && ticketService.updateAvailability(data.visitDate, data.ticketCount)) {
            setIsLoading(true);
            try {
                setAvailability(prev => prev - data.ticketCount);

                const currentUserStr = localStorage.getItem('currentUser');
                const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

                // Generate reservation code for cash payments
                const newReservationCode = data.paymentMethod === 'cash'
                    ? Math.random().toString(36).substring(7).toUpperCase()
                    : undefined;

                if (data.paymentMethod === 'cash') {
                    setReservationCode(newReservationCode || '');
                }

                const transaction = transactionService.saveTransaction({
                    email: currentUser?.email || 'anonymous',
                    visitDate: data.visitDate,
                    ticketCount: data.ticketCount,
                    ticketType: data.ticketType,
                    paymentMethod: data.paymentMethod,
                    totalAmount: calcularTotal(ticketCount, ticketType),
                    reservationCode: newReservationCode
                });

                // Send confirmation email
                await emailService.sendPurchaseConfirmation({
                    email: currentUser?.email,
                    transactionId: transaction.id,
                    visitDate: data.visitDate,
                    ticketCount: data.ticketCount,
                    ticketType: data.ticketType,
                    paymentMethod: data.paymentMethod,
                    totalAmount: calcularTotal(ticketCount, ticketType),
                    reservationCode: newReservationCode
                });

                if (data.paymentMethod === 'credit') {
                    setShowSuccessCredit(true);
                    handleCreditCardPayment();
                } else {
                    setShowSuccessCash(true);
                }

                reset({
                    visitDate: getNextAvailableDate(),
                    ticketCount: 1,
                    visitorAges: Array(10).fill(null),
                    ticketType: 'regular',
                    paymentMethod: 'cash'
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBackToHome = () => {
        setShowSuccessCash(false);
        setShowSuccessCredit(false);
        navigate('/');
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(new Date().getDate() + 28);
        return maxDate;
    };

    const isDateDisabled = (date: string) => {
        const parsedDate = new Date(date);
        const day = parsedDate.getDay();

        // Verificar si es fin de semana (viernes, sábado o domingo)
        if (![4, 5, 6].includes(day)) return true;

        // Verificar disponibilidad
        const availabilityData = JSON.parse(ticketService.getAvaibilityDays() || '{}');
        const dateStr = parsedDate.toISOString().split('T')[0];
        const hasAvailability = availabilityData[dateStr] > 0;

        return !hasAvailability;
    };

    const handleDateChange = (date: string | null) => {
        setValue('visitDate', date);
        if (date) setAvailability(ticketService.getAvailability(date));
    };

    return (
        <Container size="xl" my="40px">
            <Title order={2} mb="xl" ta={{ base: 'center', sm: 'left' }}>
                Comprar Entradas
            </Title>

            <Stack gap="xl">
                <Grid gutter={{ base: 'md', sm: 'lg', md: 'xl' }}>
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <form id="ticketForm" onSubmit={handleSubmit(onSubmit)}>
                            <Stack
                                gap="md"
                                align="stretch"
                            >
                                <Controller
                                    name="visitDate"
                                    control={control}
                                    rules={{ required: 'Debes seleccionar una fecha' }}
                                    render={({ field }) => (
                                        <DateInput
                                            {...field}
                                            label="Fecha de visita"
                                            placeholder="Selecciona una fecha"
                                            onChange={handleDateChange}
                                            excludeDate={isDateDisabled}
                                            minDate={new Date()}
                                            maxDate={getMaxDate()}
                                            valueFormat="DD/MM/YYYY"
                                            description="El parque abre únicamente los viernes, sábados y domingos"
                                            error={errors.visitDate?.message}
                                            required
                                        />
                                    )}
                                />

                                {availability === 0 ?
                                    <Text c="red.5">No hay entradas disponibles para la fecha seleccionada.</Text>
                                    :
                                    <>
                                        <Controller
                                            name="ticketCount"
                                            control={control}
                                            rules={{
                                                required: 'Debes seleccionar la cantidad de entradas',
                                                min: { value: 1, message: 'Debes comprar al menos 1 entrada' },
                                                max: { value: Math.min(10, availability), message: availability < 10 ? `Solo quedan ${availability} entradas` : 'Máximo 10 entradas por compra' }
                                            }}
                                            render={({ field }) => (
                                                <NumberInput
                                                    {...field}
                                                    label="Cantidad de entradas"
                                                    min={1}
                                                    max={Math.min(10, availability)}
                                                    description={`Máximo 10 entradas por persona. ${availability} entradas disponibles`}
                                                    error={errors.ticketCount?.message}
                                                    disabled={availability === 0}
                                                    required
                                                    w={isMobile ? '100%' : 'auto'}
                                                    onKeyDown={(e) => {
                                                        if (
                                                            !/[0-9]/.test(e.key) &&
                                                            !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)
                                                        ) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                    onPaste={(e) => {
                                                        const pasted = e.clipboardData.getData('Text')
                                                        if (!/^\d+$/.test(pasted)) e.preventDefault()
                                                    }}
                                                />
                                            )}
                                        />

                                        {ticketCount > 0 && (
                                            <Accordion variant="contained" radius="sm">
                                                <Accordion.Item value="visitors">
                                                    <Accordion.Control>
                                                        <Text size="sm" fw={500}>Datos de los visitantes ({validTicketCount})</Text>
                                                    </Accordion.Control>
                                                    <Accordion.Panel>
                                                        <Stack gap="md">
                                                            {Array.from({ length: validTicketCount }).map((_, index) => (
                                                                <Controller
                                                                    key={index}
                                                                    name={`visitorAges.${index}`}
                                                                    control={control}
                                                                    rules={{
                                                                        required: 'Edad requerida',
                                                                        min: { value: 0, message: 'Edad mínima 0' },
                                                                        max: { value: 99, message: 'Edad máxima 99' }
                                                                    }}
                                                                    render={({ field }) => (
                                                                        <NumberInput
                                                                            {...field}
                                                                            label={`Visitante ${index + 1}`}
                                                                            placeholder="Edad"
                                                                            min={0}
                                                                            max={99}
                                                                            value={field.value ?? null}
                                                                            error={errors.visitorAges?.[index]?.message}
                                                                            required
                                                                            w={isMobile ? '100%' : 'auto'}
                                                                            onKeyDown={(e) => {
                                                                                if (
                                                                                    !/[0-9]/.test(e.key) &&
                                                                                    !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)
                                                                                ) {
                                                                                    e.preventDefault()
                                                                                }
                                                                            }}
                                                                            onPaste={(e) => {
                                                                                const pasted = e.clipboardData.getData('Text')
                                                                                if (!/^\d+$/.test(pasted)) e.preventDefault()
                                                                            }}
                                                                        />
                                                                    )}
                                                                />
                                                            ))}
                                                        </Stack>
                                                    </Accordion.Panel>
                                                </Accordion.Item>
                                            </Accordion>
                                        )}
                                    </>
                                }

                                <Controller
                                    name="ticketType"
                                    control={control}
                                    rules={{ required: 'Selecciona un tipo de entrada' }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Tipo de entrada"
                                            data={[
                                                { value: 'regular', label: 'Regular' },
                                                { value: 'vip', label: 'VIP' }
                                            ]}
                                            description="La entrada VIP incluye acceso prioritario y guía personalizado"
                                            error={errors.ticketType?.message}
                                            required
                                            comboboxProps={{ position: 'bottom-start' }}

                                            w={isMobile ? '100%' : 'auto'}
                                        />
                                    )}
                                />

                                <Controller
                                    name="paymentMethod"
                                    control={control}
                                    rules={{ required: 'Selecciona un método de pago' }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Forma de pago"
                                            data={[
                                                { value: 'cash', label: 'Efectivo en boletería' },
                                                { value: 'credit', label: 'Tarjeta de crédito' }
                                            ]}
                                            description="El pago en efectivo se realiza al momento de retirar las entradas"
                                            error={errors.paymentMethod?.message}
                                            required
                                            comboboxProps={{ position: 'bottom-start' }}
                                            w={isMobile ? '100%' : 'auto'}
                                        />
                                    )}
                                />
                            </Stack>
                        </form>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        {ticketCount && ticketType && (
                            <Paper
                                withBorder
                                p="md"
                                radius="md"
                                style={{ position: isMobile ? 'static' : 'sticky', top: 20 }}
                            >
                                <Title order={3} mb="md" ta={{ base: 'center', md: 'left' }}>
                                    Resumen de compra
                                </Title>
                                <Stack
                                    gap="xs"
                                    align="stretch"
                                    justify="flex-start"
                                >
                                    <Text>
                                        {validTicketCount} entrada{ticketCount > 1 ? 's' : ''} {ticketType.toUpperCase()}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        Precio por entrada: ${calcularPrecioPorTicket(ticketType).toLocaleString()}
                                    </Text>
                                    <Text fw={500} mt="md">
                                        Total: ${calcularTotal(validTicketCount, ticketType).toLocaleString()}
                                    </Text>
                                </Stack>
                            </Paper>
                        )}
                    </Grid.Col>
                </Grid>

                <Button
                    type="submit"
                    form="ticketForm"
                    w={isMobile ? '100%' : '66%'}
                    disabled={!isValid || availability === 0}
                    color={paymentMethod === 'credit' ? 'blue' : 'green'}
                >
                    {paymentMethod === 'credit'
                        ? `Pagar con Mercado Pago ($${calcularTotal(validTicketCount, ticketType).toLocaleString()})`
                        : `Reservar y pagar en boletería ($${calcularTotal(validTicketCount, ticketType).toLocaleString()})`
                    }
                </Button>
            </Stack>

            <Modal
                opened={isLoading}
                onClose={() => { }}
                size="sm"
                centered
                withCloseButton={false}
                closeOnClickOutside={false}
            >
                <Stack align="center" gap="md" py="xl">
                    <Loader size="xl" color="green" />
                    <Text size="lg" ta="center">Procesando tu compra...</Text>
                </Stack>
            </Modal>

            <Modal
                opened={showSuccessCash}
                onClose={() => setShowSuccessCash(false)}
                size="lg"
                centered
                withCloseButton={false}
                closeOnClickOutside={false}
            >
                <Stack align="center" gap="xl" py="xl">
                    <Title order={2} c="green.7" ta="center">
                        ¡Reserva exitosa!
                    </Title>
                    <Stack gap="md" align="center">
                        <Text size="lg" ta="center">Has reservado:</Text>
                        <Text fw={500}>{ticketCount} entrada{ticketCount > 1 ? 's' : ''} {ticketType.toUpperCase()}</Text>
                        <Text>Para el día {new Date(watch('visitDate') || '').toLocaleDateString()}</Text>
                        <Text size="sm" c="dimmed" mt="md">
                            Te hemos enviado un correo electrónico con los detalles para realizar el pago en boletería.
                        </Text>
                    </Stack>
                    <Paper withBorder p="lg" radius="md" bg="green.0">
                        <Stack align="center" gap="xs">
                            <Text size="sm">Tu código de reserva es:</Text>
                            <Title order={3}>{reservationCode}</Title>
                            <Text size="xs" c="dimmed">Presenta este código en boletería</Text>
                        </Stack>
                    </Paper>
                    <Group>
                        <Button color="green" onClick={handleBackToHome}>
                            Volver al inicio
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            <Modal
                opened={showSuccessCredit}
                onClose={() => setShowSuccessCredit(false)}
                size="lg"
                centered
                withCloseButton={false}
                closeOnClickOutside={false}
            >
                <Stack align="center" gap="xl" py="xl">
                    <Title order={2} c="blue.7" ta="center">
                        ¡Compra iniciada!
                    </Title>
                    <Stack gap="md" align="center">
                        <Text size="lg" ta="center">Has seleccionado:</Text>
                        <Text fw={500}>{ticketCount} entrada{ticketCount > 1 ? 's' : ''} {ticketType.toUpperCase()}</Text>
                        <Text>Para el día {new Date(watch('visitDate') || '').toLocaleDateString()}</Text>
                        <Text size="sm" c="dimmed" mt="md">
                            Te hemos redirigido a Mercado Pago para completar tu pago.
                            Una vez finalizado, recibirás un correo electrónico con tus entradas.
                        </Text>
                    </Stack>
                    <Group>
                        <Button color="blue" onClick={handleBackToHome}>
                            Volver al inicio
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}
