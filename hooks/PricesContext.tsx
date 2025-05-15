import {PriceProductProps, ProductProps, tableKeys} from '@/types';
import {useContext, createContext, useState, useRef, useCallback} from 'react';
import { useTables } from './TablesContext';

export type Tables = (typeof tableKeys)[number];
interface LoadingContextType {
  catalog: Record<number, ProductProps[]>;
  isLoading: React.MutableRefObject<boolean>;
  calculatedList: React.MutableRefObject<Record<string, PriceProductProps[]>>;
  setProducts: (client: number, catalog: ProductProps[]) => void;
  isLoaded: React.MutableRefObject<Record<number, boolean>>;
}

const LoadingContext = createContext({} as LoadingContextType);

const PricesProvider = ({children}: React.PropsWithChildren) => {
  const {tables} = useTables();
  const [catalog, setHookProducts] = useState<Record<number, ProductProps[]>>(
    {} as Record<number, ProductProps[]>
  );
  
  const isLoading = useRef<boolean>(false);
  const isLoadingProducts = useRef<boolean>(false);
  const isLoaded = useRef<Record<number, boolean>>({});
  const calculatedList = useRef<Record<string, PriceProductProps[]>>({});
  
  const setProducts = useCallback((client: number, newCatalog: ProductProps[]) => {
    setHookProducts((prevCatalog) => {
      if (isLoadingProducts.current || prevCatalog[client]) return prevCatalog;
      isLoadingProducts.current = true;

      const restrictions = tables.current.restricaoProdutoCliente.reduce((acc: Record<number, boolean>, curr) => {
        if (curr.COD_CLIENTE === client) {
          acc[curr.COD_PRODUTO] = true;
        }
        return acc;
      }, {} as Record<number, boolean>);

      const catalogUltimaCompra = tables.current.ultima_compra;

      const hashUltimaCompra = catalogUltimaCompra?.reduce(
        (acc: { [x: string]: any; }, curr: { SEQPESSOA: number; SEQPRODUTO: string | number; }) => {
          if (curr.SEQPESSOA === client) {
            acc[curr.SEQPRODUTO] = curr;
          }
          return acc;
        },
        {} as Record<number, any>
      );

      // Mapeia os produtos e anexa o objeto ultimaCompra somente se encontrar
      const updatedProducts = newCatalog.map((p) => ({
        ...p,
        ultimaCompra: hashUltimaCompra ? hashUltimaCompra[p.COD_PRODUTO] || null : null,
      }));

      const currentCatalog = updatedProducts.filter((p) => !restrictions[p.COD_PRODUTO]);
      isLoadingProducts.current = false;

      return { ...prevCatalog, [client]: currentCatalog };
    });
  }, [tables]);

  return (
    <LoadingContext.Provider
      value={{catalog, setProducts, calculatedList, isLoading, isLoaded}}
    >
      {children}
    </LoadingContext.Provider>
  );
};

const usePrices = () => {
  const context = useContext(LoadingContext);

  if (!context)
    throw new Error(
      'O context useTables só pode ser usado dentro de seu escopo. Erro ao usar hook useTables'
    );

  return context;
};

export {PricesProvider, usePrices};