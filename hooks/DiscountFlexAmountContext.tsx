import { useClient } from "./ClientContext";
import { useGlobals } from "./GlobalContext";
import { CartItems, useCart } from "./CartContext";
import { useDiscountFlex } from "./DiscountFlexContext";
import { useMemo, useContext, createContext, useCallback } from "react";

interface HookProps {
  discountAmount: number;
  discountAmountClient: number;
  getDiscountAmountByClient: (client: number) => number;
}

const DiscountFlexAmountContext = createContext<HookProps>({} as HookProps);

const DiscountFlexAmountProvider: React.FC<any> = ({ children }) => {
  
  const { cartDetails } = useCart();
  const { paymentCode } = useGlobals();
  const { selectedClient } = useClient();
  const { discounts } = useDiscountFlex();

  const getOriginalValue = (value: number, percent: number) => {
    const porcentagemDecimal = percent / 100;
    const fatorMultiplicador = 1 + porcentagemDecimal;
    return value / fatorMultiplicador;
  };

  const mapCartItems = useMemo(() => {
    if (!cartDetails) return {};
    return Object.keys(cartDetails).reduce((acc, client) => {
      const items = cartDetails[Number(client)].items.reduce(
        (ac, p) => ({ ...ac, [`${client}-${p.uid}`]: p }),
        {}
      );
      return { ...acc, ...items };
    }, {} as { [key: string]: CartItems });
  }, [cartDetails]);

  const discountAmount = useMemo(() => {
    if (!discounts || !paymentCode) return 0;
    return Object.keys(discounts).reduce((acc, clientCod) => {
      const client = discounts[Number(clientCod)];
      return (
        acc +
        Object.keys(client).reduce((accDiscount, uid) => {
          const price = client[uid];
          const finalPrice = price.discountPrice?.[`${paymentCode}`] || 0;
          const originalPrice = getOriginalValue(finalPrice, price.percentual || 0);
  
          const multiple = mapCartItems?.[`${clientCod}-${uid}`]?.quantity || 0;
          return accDiscount + (finalPrice - originalPrice) * multiple;
        }, 0)
      );
    }, 0);
  }, [discounts, paymentCode, mapCartItems]);
  
  const discountAmountClient = useMemo(() => {
    const clientCod = selectedClient?.COD_CLIENTE;
    if (!clientCod) return 0;

    const client = discounts?.[clientCod] || {};

    return Object.keys(client).reduce((accDiscount, uid) => {
      const price = client[uid];
      const finalPrice = price.discountPrice?.[`${paymentCode}`] || 0;
      const originalPrice = getOriginalValue(finalPrice, price.percentual || 0);

      const multiple = mapCartItems?.[`${clientCod}-${uid}`]?.quantity || 0;
      return accDiscount + (finalPrice - originalPrice) * multiple;
    }, 0);
  }, [
    discounts,
    paymentCode,
    mapCartItems,
    selectedClient.COD_CLIENTE,
  ]) as number;

  const getDiscountAmountByClient = useCallback(
    (clientCod: number) => {
      if (!clientCod || !discounts) return 0;
      const client = discounts?.[clientCod] || {};
  
      return Object.keys(client).reduce((accDiscount, uid) => {
        const price = client[uid];
        const finalPrice = price.discountPrice?.[`${paymentCode}`] || 0;
        const originalPrice = getOriginalValue(finalPrice, price.percentual || 0);
  
        const multiple = mapCartItems?.[`${clientCod}-${uid}`]?.quantity || 0;
        return accDiscount + (finalPrice - originalPrice) * multiple;
      }, 0);
    },
    [discounts, paymentCode, mapCartItems]
  );  

  return (
    <DiscountFlexAmountContext.Provider
      value={{
        discountAmount,
        discountAmountClient,
        getDiscountAmountByClient,
      }}
    >
      {children}
    </DiscountFlexAmountContext.Provider>
  );
};

const useDiscountAmountFlex = (): HookProps => {
  const ctx = useContext(DiscountFlexAmountContext);

  if (!ctx) throw new Error("Erro ao usar hook Discount");

  return ctx;
};

export { DiscountFlexAmountProvider, useDiscountAmountFlex };
