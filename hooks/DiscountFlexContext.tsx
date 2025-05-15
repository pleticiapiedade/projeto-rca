import { useClient } from "./ClientContext";
import { getOnStorage, setOnStorage } from "@/shared";
import { DiscountProps, DiscountAtrProps, DiscountStorageProps } from "@/types";
import { HandlePrices } from "@/shared/calculatePrices";

import {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from "react";

interface HookProps {
  eraseDiscounts: () => void;
  clearClientDiscount: (id?: number) => void;
  discounts: { [key: number]: DiscountProps };
  setDiscount: (item: DiscountAtrProps) => void;
  deleteDiscount: (item: DiscountAtrProps) => void;
  getDiscountProduct: (productId: DiscountAtrProps) => DiscountStorageProps;
}

const DiscountFlexContext = createContext<HookProps>({} as HookProps);

const DiscountFlexProvider: React.FC<any> = ({ children }) => {
  const isLoaded = useRef(false);
  const { selectedClient } = useClient();

  const mountKey = (i: DiscountAtrProps) =>
    `${i.productId}-${i.package}-${i.quantity}`;

  const [discounts, setHookDiscount] = useState(
    {} as { [key: number]: DiscountProps }
  );

  const getDiscountProduct = useCallback(
    (i: DiscountAtrProps) => {
      return discounts?.[selectedClient.COD_CLIENTE]?.[mountKey(i)];
    },
    [discounts, selectedClient]
  );

  const clearClientDiscount = useCallback(
    (id?: number) => {
      const discountBase = { ...discounts };
      delete discountBase?.[id || selectedClient.COD_CLIENTE];
      const allDiscounts = { ...(discountBase || {}) };

      setHookDiscount(allDiscounts);
      setOnStorage("discounts", allDiscounts);
    },
    [discounts, selectedClient.COD_CLIENTE]
  );

  const eraseDiscounts = useCallback(() => {
    const allDiscounts = {};

    setHookDiscount(allDiscounts);
    setOnStorage("discounts", allDiscounts);
  }, []);

  const deleteDiscount = useCallback(
    (i: DiscountAtrProps) => {
      const newDiscounts = { ...(discounts?.[selectedClient.COD_CLIENTE] || {}) }

      delete newDiscounts[mountKey(i)]
      delete discounts?.[selectedClient.COD_CLIENTE];

      const allDiscounts = { ...(discounts || {}), [selectedClient.COD_CLIENTE]: newDiscounts };

      setOnStorage("discounts", allDiscounts);
      setHookDiscount(allDiscounts);
    },
    [discounts, selectedClient.COD_CLIENTE]
  );

  const setDiscount = useCallback(
    (i: DiscountAtrProps) => {
      const newKey = {
        ...(discounts?.[selectedClient.COD_CLIENTE] || {}),
        [mountKey(i)]: { discountPrice: i.price, percentual: i.percentual },
      };

      delete discounts?.[selectedClient.COD_CLIENTE];
      const allDiscounts = { ...(discounts || {}), [selectedClient.COD_CLIENTE]: newKey };

      setOnStorage("discounts", allDiscounts);
      setHookDiscount(allDiscounts);
    },
    [discounts, selectedClient.COD_CLIENTE]
  );

  useEffect(() => {
    if (isLoaded.current) return;

    const discounts = getOnStorage("discounts") as {
      [key: number]: DiscountProps;
    };
    isLoaded.current = true;
    setHookDiscount(discounts);
  }, []);

  return (
    <DiscountFlexContext.Provider
      value={{
        discounts,
        setDiscount,
        deleteDiscount,
        eraseDiscounts,
        getDiscountProduct,
        clearClientDiscount,
      }}
    >
      {children}
    </DiscountFlexContext.Provider>
  );
};

const useDiscountFlex = (): HookProps => {
  const ctx = useContext(DiscountFlexContext);

  if (!ctx) throw new Error("Erro ao usar hook Discount");

  return ctx;
};

export { DiscountFlexProvider, useDiscountFlex };
