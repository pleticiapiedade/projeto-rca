import { TableTypes, tableKeys } from '@/types';
import { useContext, createContext, useCallback, useRef } from 'react';

export type Tables = (typeof tableKeys)[number];

interface TableContextType {
  isLoading: React.MutableRefObject<Record<Tables, boolean>>;
  tables: React.MutableRefObject<{
    [K in Tables]: TableTypes[K];
  }>;
  setOnTables: <T extends Tables>(data: TableTypes[T], name: T) => void;
}

const TableContext = createContext({} as TableContextType);

const TablesProvider = ({ children }: React.PropsWithChildren) => {
  const tables = useRef<{
    [K in Tables]: TableTypes[K];
  }>(
    {} as {
      [K in Tables]: TableTypes[K];
    },
  );
  const isLoading = useRef<Record<Tables, boolean>>({} as Record<Tables, boolean>);

  const setOnTables = useCallback(<T extends Tables>(data: TableTypes[T], name: T) => {
    if (!data || !name || !!tables.current?.[name]) return;

    tables.current = { ...tables.current, [name]: data };
  }, []);

  return <TableContext.Provider value={{ tables, isLoading, setOnTables }}>{children}</TableContext.Provider>;
};

const useTables = () => {
  const context = useContext(TableContext);

  if (!context) throw new Error('O context useTables só pode ser usado dentro de seu escopo. Erro ao usar hook useTables');

  return context;
};

export { TablesProvider, useTables };
