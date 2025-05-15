import { setOnStorage, getOnStorage, removeFromStorage } from '@/shared';
import { createContext, useMemo, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useClient } from './ClientContext';

export interface StockProps {
  stock_left?: number;
  initial_stock?: number;
  last_sync_date?: string;
  date_update_stock_dataset?: string;
  date_update_local_stock?: string;
}

interface StockControlProps {
  product_code: number;
  stock: StockProps;
}

interface HookProps {
  stockLeft?: Record<number, StockProps>;
  handleUpdateStock: (params: StockControlProps) => void;
  handleClearStock: () => void;
  triggerCompareStocks: () => void;
}

const StockContext = createContext<HookProps>({} as HookProps);

const StockProvider: React.FC<any> = ({ children }) => {
  const { selectedClient } = useClient();
  const [shouldUpdate, setShouldUpdate] = useState(false);
  
  const [hasSynched, setHasSynched] = useState(false);
  
  const [stockLeftContext, setStockLeft] = useState(() => {
    const stock = getOnStorage('stock_left');
    if (stock) {
      return stock as Record<number, Record<number, StockProps>>;
    }
    return {} as Record<number, Record<number, StockProps>>;
  });

  const stockLeft = useMemo(() => {
    return stockLeftContext?.[selectedClient?.COD_LOJA] || {};
  }, [stockLeftContext, selectedClient?.COD_LOJA]);

  const stockRef = useRef({} as Record<number, StockProps>);

  // Atualiza o estoque no storage
  const handleUpdateStock = useCallback(({ product_code, stock }: StockControlProps) => {
    const codLoja = getOnStorage('selected_client')?.COD_LOJA || 0;
    let stockCurrent = { ...stockLeftContext };
    if (!stockCurrent?.[codLoja]) stockCurrent = { ...stockCurrent, [codLoja]: {} };
    stockCurrent[codLoja] = { ...stockCurrent[codLoja], [product_code]: stock };
    setStockLeft(stockCurrent);
    setShouldUpdate(true);
    setOnStorage('stock_left', stockCurrent);
  }, []);

  // Remove os dados de estoque do storage
  const handleClearStock = useCallback(() => {
    removeFromStorage('stock_left');
    setStockLeft({});
  }, []);

  const handleCompareStocks = useCallback(() => {
    const now = new Date();

    const datasetStockLastUpdate = getOnStorage('datasets')?.find((dataset) => dataset?.TIPO_ARQUIVO === 'estoque');

    if (datasetStockLastUpdate?.DT_UPDATE) {
      console.warn('datas: ', { now, datasetupdate: datasetStockLastUpdate?.DT_UPDATE, diff: now?.getTime() - Date.parse(datasetStockLastUpdate?.DT_UPDATE) > 0 ? 'Versão local tá mais atual' : 'Versão local tá mais antiga' });
    }

  }, [stockLeft]);

  const triggerCompareStocks = useCallback(() => {
    setHasSynched(true);
  }, []);

  useEffect(() => {
    if (hasSynched) {
      handleCompareStocks();
    }
  }, [hasSynched, handleCompareStocks]);

  useEffect(() => {
    if (stockRef.current !== stockLeft) {
      stockRef.current = stockLeft;
    }
  }, [stockLeft]);

  const context = useMemo(() => ({
    stockLeft,
    handleUpdateStock,
    handleClearStock,
    triggerCompareStocks,
  }), [stockLeft, handleUpdateStock, handleClearStock, triggerCompareStocks]) as HookProps;

  return (
    <StockContext.Provider value={context}>
      {children}
    </StockContext.Provider>
  );
};

const useStock = (): HookProps => {
  const context = useContext(StockContext);

  if (!context) throw new Error('Erro ao usar o Stock Hook');
  return context;
};

export { StockProvider, useStock };
