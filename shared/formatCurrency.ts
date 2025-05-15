interface CurrencyProps {
    value: number | string; 
    isFormat?: boolean;
    noDecimals?: boolean; 
}

export const formatCurrency = ({ value, isFormat = true, noDecimals = false }: CurrencyProps): string | number => {
    if (isFormat) {
        const options: Intl.NumberFormatOptions = {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: noDecimals ? 0 : 2,
            maximumFractionDigits: noDecimals ? 0 : 2,
        };
        const parsedValue = typeof value === 'number' ? value : parseFloat(value);
        if (isNaN(parsedValue)) return '';
        return new Intl.NumberFormat('pt-BR', options).format(parsedValue);
    } else {
        // Garantir que value é uma string antes de aplicar replace
        const stringValue = typeof value === 'number' ? value.toString() : value;
        const parsedValue = parseFloat(stringValue.replace('R$ ', '').replace(',', '.'));
        if (isNaN(parsedValue)) return '';
        return noDecimals ? Math.round(parsedValue) : parsedValue;
    }
};

/**
 * ## USO
 *
 * - isFormat true --> Transforma value (10) em string formatada (R$ 10,00)
 * - isFormat false --> Transforma value formatado (tipo string) (R$ 10,00) em número (10)
 * - noDecimals true --> Retorna o valor sem casas decimais
 *
 */
