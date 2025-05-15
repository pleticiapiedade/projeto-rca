import { ClientProps, PriceProductProps, TaxSubstitutionProps } from '@/types';

export class HandlePrices {
  static getTributacao(
    cliente: ClientProps,
    CodTrib: number,
    tributacoes: TaxSubstitutionProps[]
  ) {
    return tributacoes.find(
      (item) =>
        item.COD_TRIB_ITEM === CodTrib &&
        item.COD_REGIME_CLIENTE === cliente.COD_REGIME_TRIB &&
        item.SG_UF_ORIGEM === cliente.ESTADO
      // item.SG_UF_DESTINO === cliente.ESTADO //
    );
  }

  static preparePrice(arg: PriceProductProps) {
    let vlr = arg.VLR_PRECO;

    // Tabela Venda
    if (arg.PERACRENTREGA !== 0 && arg.INDUSAACRESCTABVENDA === 'S') {
      vlr = HandlePrices.calculaPercentual(vlr, arg.PERACRENTREGA);
    }

    // Prazo Pagamento
    if (arg.PERACRFINANCEIRO !== 0) {
      vlr = HandlePrices.calculaPercentual(vlr, arg.PERACRFINANCEIRO);
    }

    // Acrecimo/Decréscimo cliente
    if (arg.PERC_CLIENTE !== 0) {
      vlr = HandlePrices.calculaPercentual(vlr, arg.PERC_CLIENTE);
    }

    // Acrecimo Fornecedor
    if (arg.PERACRESCDESC !== 0) {
      vlr = HandlePrices.calculaPercentual(vlr, arg.PERACRESCDESC);
    }

    return Math.round(vlr * 100) / 100;
  }

  static calculaPercentual(valor: number, percentual: number) {
    const acao = percentual < 0 ? 1 : 0;

    const referenceValue = (valor * Math.abs(percentual)) / 100;
    const roundedValue = Math.round(referenceValue * 100) / 100;

    return !!acao ? valor - roundedValue : valor + roundedValue;
  }

  static CalculaST(
    trib: TaxSubstitutionProps | void,
    preco: number,
    vlrPauta: number
  ) {

    if (!!trib && trib.PERC_MVA_ST !== 0) {
      const aliq_icms = Number(
        (
          (trib.PERC_ALIQ_ICMS * trib.PERC_TRIBUTADO_ICMS) / 100 +
          trib.PERC_FCP_ST
        ).toFixed(4)
      );
      const vlrIcms = Number(((preco * aliq_icms) / 100).toFixed(4));

      let baseSt = Number(vlrPauta.toFixed(4));
      if (vlrPauta < preco) {
        baseSt = Number((preco + (preco * trib.PERC_MVA_ST) / 100).toFixed(4));
      }

      const percTribSt = trib.PERC_TRIBUTADO_ST || trib.PERC_TRIBUTADO_ICMS;

      const aliq_st = Number(
        ((trib.PERC_ALIQ_ST * percTribSt) / 100 + trib.PERC_FCP_ST).toFixed(4)
      );

      const vlrIcmsSt = Number(((baseSt * aliq_st) / 100));
      return Number((vlrIcmsSt - vlrIcms).toFixed(2));
    }

    return 0;
  }
}

export const calcPrice = (
  client: ClientProps,
  prices: PriceProductProps[],
  listaTributacao: TaxSubstitutionProps[],
): PriceProductProps[] => {
  if (!client?.COD_CLIENTE || !listaTributacao.length) return [];

  const newPrices = [...prices];
  for (const price of newPrices) {
    let precoSt = 0;

    price.PERC_CLIENTE = client.PERC_CLIENTE;

    const precoCalculado = HandlePrices.preparePrice(price);

    if (price.DESTACA_ST === 'S') {

      const tributacao = HandlePrices.getTributacao(
        client,
        price.COD_TRIBUTACAO_PRODUTO,
        listaTributacao
      );

      precoSt = HandlePrices.CalculaST(
        tributacao,
        precoCalculado,
        price.VLR_PAUTA
      );

      if (price.QTD_MULTIPLO_VENDA > 1) {
        precoSt = precoSt * price.QTD_MULTIPLO_VENDA;
      }

      price.ST_VLR_FINAL = Number((precoSt.toFixed(2)));
      
    }
    
    price.VLR_PRECO_CALCULADO = precoCalculado * price.QTD_MULTIPLO_VENDA;

    price.VLR_FINAL = Number((price.VLR_PRECO_CALCULADO + precoSt).toFixed(2));
  }

  return newPrices;
};
