export const arrToObj = (v: any[]): any =>
  v.reduce((acc, item) => {
    const [[key, value]] = Object.entries(item);
    return { ...acc, [key]: value };
  }, {});

export const cleanStr = (v: string): string =>
  v
    ?.trim()
    ?.toLowerCase()
    ?.normalize('NFD')
    .replace(/\p{Mn}/gu, '') || v;

export const cleanInput = (v: string): string => v?.trim()?.replace(/[^0-9.]/g, '');

export const copy = (v: any): any => {
  try {
    return JSON.parse(JSON.stringify(v));
  } catch (e) {
    return v;
  }
};

export const formatarTelefone = (numero?: number | string) => {
  const numeroLimpo = `${numero}`.replace(/\D/g, '');

  if (numeroLimpo.length < 10) return numero;

  const match = numeroLimpo.match(/^(\d{2})(\d{4,5})(\d{4})$/);

  if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;

  return numero;
};

export const formatarCEP = (cep?: string | number) => {
  const cepLimpo = `${cep}`.replace(/\D/g, '');
  const match = cepLimpo.match(/^(\d{5})(\d{0,3})$/);

  if (!match) return cep;

  return match[2] ? `${match[1]}-${match[2]}` : match[1];
};

type dateFormat = {
  year?: '2-digit';
};

export const formatarData = (dataStr?: string | number, params?: dateFormat) => {
  if (!dataStr) return dataStr;

  // Verifica se dataStr é um número e converte para uma data
  const dataValida = typeof dataStr === 'number' && !isNaN(dataStr) ? new Date(dataStr) : new Date(dataStr);

  // Verifica se a data é válida
  if (isNaN(dataValida.getTime())) return dataStr; // Retorna o valor original se a data não for válida

  // Formata a data no formato desejado (DD/MM/AAAA)
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: params?.year || 'numeric' };
  return dataValida.toLocaleDateString('pt-BR', options);
};

export const calcularDiasAtras = (dataString: string) => {
  const hoje = new Date();
  const dataPassada = new Date(dataString);

  hoje.setHours(0, 0, 0, 0);
  dataPassada.setHours(0, 0, 0, 0);
  const diferencaEmMilissegundos = hoje.getTime() - dataPassada.getTime();
  const diferencaEmDias = Math.floor(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));

  return diferencaEmDias >= 0 ? diferencaEmDias : 0;
};

export const pxToPdf = (px: number) => {
  const PDI = 72;
  const MILIMETRO_POR_POLEGADA = 25.4;

  const mm = (px * MILIMETRO_POR_POLEGADA) / PDI;
  const convertedPx = (mm * PDI) / MILIMETRO_POR_POLEGADA;
  return `${convertedPx.toFixed(2)}px`;
};
