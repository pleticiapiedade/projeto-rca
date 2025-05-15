import { useStock } from './StockContext';
import { useClient } from './ClientContext';
import { useTables } from './TablesContext';
import { useDiscountFlex } from './DiscountFlexContext';
import { ClientProps, ProductProps, StockProps } from '@/types';
import { getOnStorage, removeFromStorage, setOnStorage } from '@/shared';
import React, { createContext, Dispatch, RefObject, SetStateAction, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';

export interface CartItems {
  sku: number;
  uid: string;
  quantity: number;
  option_uid: string;
  category_id: number;
}

export interface CartDetailsProps {
  id?: string;
  total?: number;
  quantity: number;
  subtotal?: number;
  items: CartItems[];
}

export interface CartProps {
  cartId: string;
  cart: CartItems[];
  filterTerm: string;
  isSearching: boolean;
  // estoque: StockProps[];
  totalQuantity: number;
  cartDetails: Record<number, CartDetailsProps>;
  isAdding: boolean;
  hasOrderNumberSaved: boolean;

  checkLimit: (
    uid: string,
    sku: number,
    quantity: number,
    updatedCart: CartItems[],
    showAlert?: boolean
  ) => number;
  addProductToCart: (data: {
    sku: number;
    quantity: number;
    option_uid: string;
    uid: string;
    category_id: number;
  }) => void;
  updateProductAmount: (data: {
    uid: string;
    sku: number;
    quantity: number;
  }) => void;
  clearCart: () => void;
  handleRemoveItems: () => void;
  getLimit: (sku: number) => number;
  getStockMsg: (sku: number) => string | undefined;
  setFilterTerm: Dispatch<SetStateAction<string>>;
  removeProductFromCart: ({ uid }: { uid: string }) => void;
  removeMultipleProductsFromCart: (uids: string[]) => void;
  createEmptyCart: ({ client }: { client: ClientProps }) => void;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  loadedEstoque: RefObject<boolean>;
  setCartLoading: Dispatch<SetStateAction<boolean>>;
  cartLoading: boolean;
}

export const CartContext = createContext({} as CartProps);

const CartProvider = ({ children }: React.PropsWithChildren) => {
  const { tables } = useTables();
  const { stockLeft } = useStock();
  const { selectedClient } = useClient();
  const { clearClientDiscount } = useDiscountFlex();

  const loadedEstoque = useRef(false);
  const catalog = useMemo(() => tables.current?.dicionario_produtos || {}, [tables.current?.dicionario_produtos]);

  const [isAdding, setIsAdding] = useState(false);
  const [filterTerm, setFilterTerm] = useState('');
  const [cartLoading, setCartLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [cart, setCart] = useState<CartItems[]>(() => {
    const savedCart = getOnStorage('cart_details');
    return savedCart?.[selectedClient?.COD_CLIENTE]?.items ?? [];
  });

  const [cartDetails, setCartDetails] = useState<Record<number, CartDetailsProps>>(() => {
    return getOnStorage('cart_details') || {};
  });

  const [cartId, setCartId] = useState(() => getOnStorage('cart_id') || '');
  const [hasOrderNumberSaved, setHasOrderNumberSaved] = useState(false);

  

  const dictEstoque = useMemo(() => {
    if (!tables.current?.estoque || !selectedClient?.COD_LOJA) return {};
    
    const estoqueMap = new Map<number, StockProps>();
    for (const item of tables.current.estoque) {
      if (item.COD_LOJA === selectedClient.COD_LOJA) {
        estoqueMap.set(item.COD_PRODUTO, item);
      }
    }
    return Object.fromEntries(estoqueMap);
  }, [tables.current?.estoque, selectedClient?.COD_LOJA]);

  const totalQuantity = useMemo(() => {
    return cartDetails?.[selectedClient?.COD_CLIENTE]?.quantity || 0;
  }, [cartDetails, selectedClient?.COD_CLIENTE]);

  const getLimit = useCallback(
    (id: number) => dictEstoque[id]?.QTD_ESTOQUE || 0,
    [dictEstoque]
  );

  const getStockMsg = useCallback(
    (id: number) => dictEstoque[id]?.MSG_ESTOQUE,
    [dictEstoque]
  );

  const removeProductFromCart = useCallback(
    ({ uid }: { uid: string }) => {
      if (!selectedClient?.COD_CLIENTE) return;

      const clientCart = cartDetails[selectedClient.COD_CLIENTE];
      if (!clientCart?.items) return;

      const newCart = clientCart.items.filter(product => product.uid !== uid);
      const total = newCart.reduce((acc, i) => acc + (i?.quantity || 0), 0);

      const updatedCartDetails = {
        ...cartDetails,
        [selectedClient.COD_CLIENTE]: {
          items: newCart,
          quantity: total
        }
      };

      setCart(newCart);
      setCartDetails(updatedCartDetails);
      setOnStorage('cart_details', updatedCartDetails);
    },
    [cartDetails, selectedClient?.COD_CLIENTE]
  );

  const removeMultipleProductsFromCart = useCallback(
    (uids: string[]) => {
      if (!selectedClient?.COD_CLIENTE || !uids?.length) return;

      const clientCart = cartDetails[selectedClient.COD_CLIENTE];
      if (!clientCart?.items?.length) return;

      const newCart = clientCart.items.filter(product => !uids.includes(product.uid));
      if (newCart.length === clientCart.items.length) return;

      const total = newCart.reduce((acc, i) => acc + (i?.quantity || 0), 0);
      
      const updatedCartDetails = {
        ...cartDetails,
        [selectedClient.COD_CLIENTE]: {
          items: newCart,
          quantity: total,
        }
      };
      
      setCartDetails(updatedCartDetails);
      setOnStorage('cart_details', updatedCartDetails);
    },
    [cartDetails, selectedClient?.COD_CLIENTE]
  );

  const checkLimit = useCallback(
    (uid: string, sku: number, quantity: number, updatedCart: CartItems[]): number => {
      const packQtd = Number(uid?.split('-')[2]);
      const initialQtd = quantity * packQtd;

      let totalAmount = initialQtd;
      for (const item of updatedCart) {
        if (item.sku === sku && uid !== item.uid) {
          const [, qtd] = item.option_uid.split('_');
          totalAmount += item.quantity * Number(qtd);
        }
      }

      const limit = getLimit(sku);
      const stock = stockLeft?.[sku]?.stock_left ?? 0;
      const hasStockInfo = stockLeft?.[sku]?.hasOwnProperty('stock_left');
      const availableQty = hasStockInfo ? stock : limit;

      if (availableQty < totalAmount) {
        const remainingQty = availableQty - (totalAmount - initialQtd);
        return Math.max(0, Math.trunc(remainingQty / packQtd));
      }

      return quantity;
    },
    [getLimit, stockLeft]
  );

  const saveOrderNumber = useCallback((client: ClientProps, orderNumber: string) => {
    if (!client?.COD_CLIENTE) return;

    const storedOrders = getOnStorage('order_numbers') || {};
    setOnStorage('order_numbers', {
      ...storedOrders,
      [client.COD_CLIENTE]: { orderNumber }
    });
  }, []);

  const generateOrderNumber = useCallback(() => {
    if (!selectedClient?.COD_CLIENTE) return '';

    const now = new Date();
    const seqpessoa = selectedClient.COD_RCA;
    const date = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    const orderNumber = `${seqpessoa}${date}${month}${year}${hours}${minutes}${seconds}`;
    saveOrderNumber(selectedClient, orderNumber);

    return orderNumber;
  }, [selectedClient, saveOrderNumber]);

  const getOrGenerateOrderNumber = useCallback(() => {
    if (!selectedClient?.COD_CLIENTE) return '';

    const storedOrders = getOnStorage('order_numbers') || {};
    const orderNumber = storedOrders[selectedClient.COD_CLIENTE]?.orderNumber || generateOrderNumber();

    if (!storedOrders[selectedClient.COD_CLIENTE]?.orderNumber) {
      saveOrderNumber(selectedClient, orderNumber);
    }

    return orderNumber;
  }, [selectedClient, generateOrderNumber, saveOrderNumber]);

  useEffect(() => {
    if (!selectedClient?.COD_CLIENTE) {
      setHasOrderNumberSaved(false);
      return;
    }

    const storedOrders = getOnStorage('order_numbers') || {};
    const clientCart = cartDetails[selectedClient.COD_CLIENTE];
    const clientOrder = storedOrders[selectedClient.COD_CLIENTE];

    // Se não existir orderNumber e houver itens no carrinho, gera um novo orderNumber
    if (!clientOrder?.orderNumber && clientCart && clientCart.items && clientCart.items.length > 0) {
      const newOrderNumber = generateOrderNumber();
      storedOrders[selectedClient.COD_CLIENTE] = { orderNumber: newOrderNumber };
      setOnStorage('order_numbers', storedOrders);
      setHasOrderNumberSaved(true);
    } else {
      setHasOrderNumberSaved(!!clientOrder?.orderNumber);
    }
  }, [selectedClient, cartDetails, generateOrderNumber]);

  const createEmptyCart = useCallback(
    ({ client }: { client: ClientProps | undefined }) => {
      if (!client?.COD_CLIENTE) return;

      const cartId = String(client.COD_CLIENTE);
      setCartId(cartId);
      setOnStorage('cart_id', cartId);
    },
    []
  );

  const addProductToCart = useCallback(
    ({ sku, quantity, option_uid, uid, category_id }: {
      sku: number;
      quantity: number;
      option_uid: string;
      uid: string;
      category_id: number;
    }) => {
      if (!selectedClient?.COD_CLIENTE) {
        alert('Por favor, selecione um cliente para continuar');
        return;
      }

      getOrGenerateOrderNumber();
      setIsAdding(true);

      setCartDetails(prevCartDetails => {
        const clientCart = prevCartDetails[selectedClient.COD_CLIENTE] || { items: [] };
        const updatedCart = [...clientCart.items];

        quantity = checkLimit(uid, sku, quantity, updatedCart);
        if (quantity <= 0) return prevCartDetails;

        const existingProductIndex = updatedCart.findIndex(
          product => product.sku === sku && product.uid === uid
        );

        if (existingProductIndex >= 0) {
          updatedCart[existingProductIndex].quantity = quantity;
        } else {
          updatedCart.push({ uid, sku, quantity, option_uid, category_id });
        }

        const total = updatedCart.reduce((acc, i) => acc + (i?.quantity || 0), 0);
        const newCartDetails = {
          ...prevCartDetails,
          [selectedClient.COD_CLIENTE]: { items: updatedCart, quantity: total }
        };

        setOnStorage('cart_details', newCartDetails);
        return newCartDetails;
      });

      setIsAdding(false);
    },
    [selectedClient, checkLimit, getOrGenerateOrderNumber]
  );

  const updateProductAmount = useCallback(
    ({ uid, sku, quantity }: { uid: string; sku: number; quantity: number }) => {
      if (!selectedClient?.COD_CLIENTE) {
        alert('Por favor, selecione um cliente para continuar');
        return;
      }

      getOrGenerateOrderNumber();
      const clientCart = cartDetails[selectedClient.COD_CLIENTE];
      if (!clientCart?.items) return;

      const updatedCart = [...clientCart.items];
      quantity = checkLimit(uid, sku, quantity, updatedCart);

      if (quantity < 0) return;

      const productIndex = updatedCart.findIndex(
        item => item.sku === sku && item.uid === uid
      );

      if (productIndex >= 0) {
        updatedCart[productIndex].quantity = quantity;
        const total = updatedCart.reduce((acc, i) => acc + (i?.quantity || 0), 0);

        setCart(updatedCart);
        setCartDetails({
          ...cartDetails,
          [selectedClient.COD_CLIENTE]: {
            items: updatedCart,
            quantity: total
          }
        });
      }
    },
    [cartDetails, selectedClient, checkLimit, getOrGenerateOrderNumber]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    removeFromStorage('cart');
  }, []);

  const handleRemoveItems = useCallback(() => {
    if (!selectedClient?.COD_CLIENTE) return;

    clearClientDiscount();
    setCartDetails({
      ...cartDetails,
      [selectedClient.COD_CLIENTE]: { items: [], quantity: 0 }
    });
    setOnStorage('cart_details', {
      ...cartDetails,
      [selectedClient.COD_CLIENTE]: { items: [], quantity: 0 }
    });
  }, [cartDetails, selectedClient?.COD_CLIENTE, clearClientDiscount]);

  useEffect(() => {
    if (!selectedClient?.COD_CLIENTE) {
      setHasOrderNumberSaved(false);
      return;
    }

    const storedOrders = getOnStorage('order_numbers') || {};
    setHasOrderNumberSaved(!!storedOrders[selectedClient.COD_CLIENTE]?.orderNumber);
  }, [selectedClient]);

  const contextValue = useMemo(
    () => ({
      cart,
      cartId,
      cartDetails,
      totalQuantity,
      addProductToCart,
      getLimit,
      getStockMsg,
      loadedEstoque,
      removeProductFromCart,
      removeMultipleProductsFromCart,
      updateProductAmount,
      createEmptyCart,
      clearCart,
      checkLimit,
      handleRemoveItems,
      isSearching,
      setIsSearching,
      filterTerm,
      setFilterTerm,
      isAdding,
      cartLoading,
      setCartLoading,
      hasOrderNumberSaved
    }),
    [
      cart,
      cartId,
      cartDetails,
      totalQuantity,
      getStockMsg,
      getLimit,
      checkLimit,
      addProductToCart,
      removeProductFromCart,
      removeMultipleProductsFromCart,
      updateProductAmount,
      createEmptyCart,
      clearCart,
      handleRemoveItems,
      isSearching,
      filterTerm,
      isAdding,
      cartLoading,
      hasOrderNumberSaved
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);

  if (!context)
    throw new Error(
      'O context useCart só pode ser usado dentro de seu escopo. Erro ao usar hook useCart'
    );

  return context;
};

export { CartProvider, useCart };
