import { Loading } from '@/components';
import { getOnStorage } from '@/shared';
import { useDbFunctions } from '@/talons';
import { tableKeys } from '@/types';
import styled from 'styled-components';
import { useContext, createContext, useEffect, useState, useRef } from 'react';
import { colors } from '@/constants';
import { useLocation } from 'react-router-dom';

const LoadingContainer = styled.div`
  flex: 1;
  height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  background-color: ${colors.gray.gray0};
`;

export type Tables = (typeof tableKeys)[number];
const listTables: Tables[] = [...tableKeys];

interface LoadingContextType {
  isLoading: boolean;
}

const LoadingContext = createContext({} as LoadingContextType);

const LoaderProvider = ({ children }: React.PropsWithChildren) => {
  const { getOnDB } = useDbFunctions();
  const isNotLogged = ['#/login', '#/'].includes(window.location.hash);
  const [isLoading, setIsLoading] = useState<boolean>(!isNotLogged);
  const currentLoading = useRef(false);

  useEffect(() => {
    if (currentLoading.current || isNotLogged) return;
    currentLoading.current = true;

    const token = !!getOnStorage('token_magento');
    const rcaCustomer = !!getOnStorage('rca_usuario');
    const listToRemove = [
      'ciclo_venda_cliente_cliente',
      'imagens',
      'catalogo',
      'janela_entrega',
      'pedidos_offline',
      'checkoutOrderData',
      'checkoutOrderItems',
      'checkoutCartTotals',
    ] as Tables[];
    

    const tablesToDownload = listTables.filter((table) => !listToRemove.includes(table));

    if (token && rcaCustomer) {
      setIsLoading(true);
      const loadData = async () => {
        for (const table of tablesToDownload) {
          await getOnDB(table).then(() => { }).catch((err) => {
            console.log(err);
          });
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      };
      loadData();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <LoadingContext.Provider
      value={{ isLoading }}
    >
      {isLoading ? (
        <LoadingContainer>
          <Loading scale={2} />
        </LoadingContainer>
      ) : (
        children
      )}
    </LoadingContext.Provider>
  );
};

const useLoader = () => {
  const context = useContext(LoadingContext);

  if (!context)
    throw new Error(
      'O context useTables só pode ser usado dentro de seu escopo. Erro ao usar hook useTables'
    );

  return context;
};

export { LoaderProvider, useLoader };