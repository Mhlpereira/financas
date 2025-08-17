export function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

export function formatCurrencySimple(value: number): string {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}
