import { useClient } from "./ClientContext";
import { useCalcPrice } from "@/talons";
import { useTables } from "./TablesContext";
import { useGlobals } from "./GlobalContext";
import { CartItems, useCart } from "./CartContext";
import { useDiscountFlex } from "./DiscountFlexContext";
import { PriceProductProps, TaxSubstitutionProps } from "@/types";
import { useMemo, useContext, useCallback, createContext} from "react";
import { HandlePrices } from "@/shared/calculatePrices";
import { usePrices } from "./PricesContext";

interface CartToTalsProps {
  cartTotals: {
    total: number;
    subtotal: number;
    st_price: number;
  };
  fetchCorrectPrice: (
    price: PriceProductProps[],
    option_uid: string,
    paymentCondition: number
  ) => PriceProductProps | {
    VLR_PRECO: number;
    VLR_FINAL: number;
    ST_VLR_FINAL?: number;
    VLR_PRECO_CALCULADO?: number;
    COD_TRIBUTACAO_PRODUTO?: number;
    VLR_PAUTA?: number;
  };
  fetchTotalPriceByPaymentCode: (code: number) => number;
  listaTributacao: TaxSubstitutionProps[];
}

export const CartTotalsContext = createContext({} as CartToTalsProps);

const CartTotalsProvider = ({ children }: React.PropsWithChildren) => {
  const { tables } = useTables();
  const { getPrices } = useCalcPrice();
  const { calculatedList } = usePrices();
  const products = tables.current.dicionario_produtos;
  const listaTributacao = tables.current.cod_regime_tributario;

  const { cartDetails } = useCart();
  const { paymentCode } = useGlobals();
  const { selectedClient } = useClient();
  const { getDiscountProduct } = useDiscountFlex();

  const fetchCorrectPrice = useCallback(
    (
      price: PriceProductProps[],
      option_uid: string,
      paymentCondition: number
    ) => {
      const [packing, quantity] = option_uid?.split("_");

      const correctPrice = price?.find((p: PriceProductProps) => {
        if (p?.QTD_MULTIPLO_VENDA > 1) {
          return (
            p.SG_EMBALAGEM === packing &&
            p.QTD_MULTIPLO_VENDA?.toString() === quantity &&
            p.NROCONDICAOPAGTO === paymentCondition
          )
        }
        return (
          p.SG_EMBALAGEM === packing &&
          p.QTD_EMBALAGEM?.toString() === quantity &&
          p.NROCONDICAOPAGTO === paymentCondition
        );
      });

      return (
        correctPrice || {} as PriceProductProps
      );
    },
    []
  );

  const fetchTotalPriceByPaymentCode = useCallback(
    (code: number) => {
      if (
        cartDetails?.[selectedClient?.COD_CLIENTE]?.items?.length > 0 &&
        code
      ) {
        const totals = cartDetails?.[selectedClient?.COD_CLIENTE]?.items?.reduce((acc: number, item: CartItems) => {
          if (!products?.[item?.sku]) return acc;
          const prices = calculatedList.current?.[item?.sku] || getPrices(products?.[item?.sku]);

          if (!!prices) {
            const [packing, qtd] = item?.option_uid?.split("_");

            const discountprice = getDiscountProduct({
              package: packing,
              productId: item?.sku,
              quantity: Number(qtd),
            })?.discountPrice?.[`${code}`];

            const price = prices.filter((p: PriceProductProps) => p.COD_LOJA === selectedClient.COD_LOJA)?.find((i: PriceProductProps) => {
              if (i?.QTD_MULTIPLO_VENDA > 1) {
                return (
                  i?.QTD_MULTIPLO_VENDA?.toString() === qtd &&
                  i?.SG_EMBALAGEM === packing &&
                  i?.NROCONDICAOPAGTO === code
                )
              }
              return (
                i?.QTD_EMBALAGEM?.toString() === qtd &&
                i?.SG_EMBALAGEM === packing &&
                i?.NROCONDICAOPAGTO === code
              );
            });

            const finalprice = discountprice || price?.VLR_FINAL || price?.VLR_PRECO;

            if (finalprice) {
              const fullprice = finalprice * item?.quantity;
              if (fullprice) return (acc += fullprice);
            }
          }
          return acc;
        }, 0);
        return totals;
      }
      return 0;
    },
    [cartDetails, products, getDiscountProduct, selectedClient]
  );

  const handleCalcStTotals = useCallback((code: number) => {
    if (cartDetails?.[selectedClient?.COD_CLIENTE]?.items?.length > 0 && code) {
      const stTotals = cartDetails?.[selectedClient?.COD_CLIENTE]?.items?.reduce((acc: number, item: CartItems) => {
        if (!products?.[item?.sku]) return acc;
        const prices = calculatedList.current?.[item?.sku] || getPrices(products?.[item?.sku]);

        if (!!prices.length) {
          const [packing, qtd] = item?.option_uid?.split("_");

          const price = prices.filter((p: PriceProductProps) => p.COD_LOJA === selectedClient.COD_LOJA).find((i: PriceProductProps) => {

            if (i?.QTD_MULTIPLO_VENDA > 1) {
              return (
                i?.QTD_MULTIPLO_VENDA?.toString() === qtd &&
                i?.SG_EMBALAGEM === packing &&
                i?.NROCONDICAOPAGTO === code
              )
            }
            return (
              i?.QTD_EMBALAGEM?.toString() === qtd &&
              i?.SG_EMBALAGEM === packing &&
              i?.NROCONDICAOPAGTO === code
            );
          });

          if (price?.DESTACA_ST === 'S' && selectedClient?.COD_LOJA === 743 && listaTributacao?.length && price?.VLR_PRECO_CALCULADO) {
            const tributacao = HandlePrices.getTributacao(selectedClient, price?.COD_TRIBUTACAO_PRODUTO, listaTributacao);

            const precoSt = HandlePrices.CalculaST(tributacao, price?.VLR_PRECO_CALCULADO * item?.quantity, price?.VLR_PAUTA);

            if (precoSt) {
              return acc += precoSt;
            }
            return acc;
          }
          return acc;
        }
        return acc;
      }, 0);
      return stTotals;
    }
    return 0;
  }, [cartDetails, products, listaTributacao, selectedClient]);

  const cartTotals = useMemo(() => {
    const total = fetchTotalPriceByPaymentCode(paymentCode);
    const stTotals = handleCalcStTotals(paymentCode);
    return {
      total,
      subtotal: total - stTotals,
      st_price: stTotals,
    }
  }, [paymentCode, fetchTotalPriceByPaymentCode, handleCalcStTotals]);

  return (
    <CartTotalsContext.Provider value={{
      cartTotals,
      fetchCorrectPrice,
      fetchTotalPriceByPaymentCode,
      listaTributacao,
    }}>
      {children}
    </CartTotalsContext.Provider>
  );
};

const useCartTotals = () => {
  const context = useContext(CartTotalsContext);

  if (!context) {
    throw new Error(
      "o context useCartTotals só pode ser utilizado dentro de seu escopo. Erro ao usar hook useCartTotals"
    );
  }
  return context;
};

export { CartTotalsProvider, useCartTotals };
