import { dashboardsMock } from '@/mocks';
import DEFAULT_OPERATIONS from './user.gql';
import { useLazyQuery } from '@apollo/client';
import { CustomerDataProps, DashboardsProps } from '@/types';
import { CheckoutPageProps } from '@/talons/checkoutPage/type';
import { useState, useEffect, useContext, useCallback, createContext } from 'react';
import { useClient, useFetchAxios, useNetworkStatusContext, useTables } from '../index';
import { getOnStorage, setOnStorage, updateOnStorage, removeFromStorage } from '@/shared';

interface UserContextProps {
  email: string;
  taxVat: string;
  getCustomer: any;
  valorMinimo: number;
  userToken: string;
  isSignedIn: boolean;
  dashboards: DashboardsProps;
  customer: CustomerDataProps;
  rcaSaldoFlex: number | null;

  signOut: () => void;
  setEmail: (value: string) => void;
  setTaxVat?: (value: string) => void;
  setUserToken?: (value: string) => void;
  setRcaSaldoFlex?: (value: number) => void;
  setIsSignedIn: (value: boolean) => void;
  setCustomer: (value: CustomerDataProps) => void;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

const UserProvider: React.FC<any> = ({ children }) => {
  const {tables} = useTables();
  const { axiosCtx } = useFetchAxios();
  const { getCustomerQuery } = DEFAULT_OPERATIONS;
  const { setPositivacao, selectedClient } = useClient();
  const { connectivityStatus } = useNetworkStatusContext();

  const [userToken] = useState('');
  const [email, setEmail] = useState('');
  const [taxVat, setTaxVat] = useState('');
  const [valorMinimo, setValorMinimo] = useState(0);
  const [dashboards] = useState(dashboardsMock as DashboardsProps);

  const [customer, setCustomer] = useState<CustomerDataProps>(() => {
    const rcaCustomer = getOnStorage('rca_usuario');
    if (rcaCustomer) return rcaCustomer;
    return {} as CustomerDataProps;
  });

  const [isSignedIn, setIsSignedIn] = useState(() => {
    const token = !!getOnStorage('token_magento');
    const rcaCustomer = !!getOnStorage('rca_usuario');
    return token && rcaCustomer;
  });

  useEffect(() => {
    const token = !!getOnStorage('token_magento');
    const rcaCustomer = !!getOnStorage('rca_usuario');
    setIsSignedIn(token && rcaCustomer);
  }, []);

  const [rcaSaldoFlex, setRcaSaldoFlex] = useState<number | null>(() => {
    const rcaCustomer = getOnStorage('rca_usuario');
    return rcaCustomer?.saldoFlex || null;
  });

  const getParamsAWS = useCallback(async () => {
    const parametrosAws = tables.current.parametros_aws;

    const vlrMin = parametrosAws?.find(p => p.DESC_PARAMETRO === 'VLR_MINIMO_PEDIDO' && p.ST_PARAMETRO === 'A')?.VALOR_PARAMETRO;
    setValorMinimo(vlrMin ? Number(vlrMin) : 0);
  }, [setValorMinimo]);

  useEffect(() => {
    getParamsAWS();
  }, [getParamsAWS]);

  const [getCustomer, { error: errorCustomer, loading: loadingCustomer }] = useLazyQuery(getCustomerQuery);

  useEffect(() => {
    const token = getOnStorage('token_magento');
    const rcaCustomer = getOnStorage('rca_usuario');
    const signInStatus = !!(token && rcaCustomer);

    if (signInStatus !== isSignedIn) setIsSignedIn(signInStatus);
    if (!customer && rcaCustomer && signInStatus) setCustomer(rcaCustomer || ({} as CustomerDataProps));

    if (signInStatus && rcaSaldoFlex === null) {
      const fetchSaldoFlex = async () => {
        const fetchedSaldoFlex = tables.current.saldo_flex;
        const matchingSaldoFlex = fetchedSaldoFlex?.find((saldo: any) => saldo.COD_PESSOA === rcaCustomer?.codPessoa);

        if (matchingSaldoFlex) {
          const updatedCustomer = {
            ...rcaCustomer,
            saldoFlex: matchingSaldoFlex.VLR_ERP,
            saldoERP: matchingSaldoFlex.VLR_ERP,
          };
          updateOnStorage('rca_usuario', updatedCustomer);
          setRcaSaldoFlex(matchingSaldoFlex.VLR_ERP);
          setCustomer(updatedCustomer);
        }
      };

      fetchSaldoFlex();
    }
  }, [customer, isSignedIn, rcaSaldoFlex]);

  useEffect(() => {
    if (rcaSaldoFlex !== null) {
      const rcaCustomer = getOnStorage('rca_usuario');
      if (rcaCustomer) {
        updateOnStorage('rca_usuario', {
          ...rcaCustomer,
          saldoFlex: rcaSaldoFlex,
        });
      }
    }
  }, [rcaSaldoFlex]);

  const processOfflineOrders = useCallback(async (offlineOrders: CheckoutPageProps[]) => {
    offlineOrders.forEach((order: any) => {
      order.orders.status = "processando";
    })

    offlineOrders.map(async (order, index) => {
      const response = await axiosCtx
      .post("/integra-pedido", order)
      .then(res => res?.data?.message)
      .catch((error) => `Error, ${error}`);

      if (response) {
        let synched = await getOnStorage("synched_orders");
        if (!synched) synched = [];
        synched.push(order)
        setOnStorage("synched_orders", synched);
        offlineOrders.splice(index, 1);
        const skus = order?.orders?.actions_pending?.map(i => Number(i.sku)) || [];
        setPositivacao('produto', skus);
        setPositivacao('cliente', [Number(selectedClient?.COD_CLIENTE)]);
        setOnStorage("offline_orders", offlineOrders);
      }
    })
    
  }, [axiosCtx, selectedClient?.COD_CLIENTE, setPositivacao])

  useEffect(() => {
    const offlineOrders = getOnStorage('offline_orders') as CheckoutPageProps[]
    if (connectivityStatus === 'online' && offlineOrders?.length) {
      processOfflineOrders(offlineOrders)
    }
    
  }, [processOfflineOrders, connectivityStatus, axiosCtx]);

  const signOut = useCallback(async () => {
    if (connectivityStatus !== "online") {
      const tokenOffline = getOnStorage('token_magento');
      if (tokenOffline) {
        await Promise.all([setOnStorage('token_offline', tokenOffline), removeFromStorage('token_magento')]);
      }
    } else {
      await Promise.all([
        removeFromStorage('login_date'),
        removeFromStorage('token_magento'),
        removeFromStorage('token_aws'),
        removeFromStorage('rca'),
        removeFromStorage('selected_client'),
        removeFromStorage('new_data_sets'),
        removeFromStorage('discounts'),
        removeFromStorage('rca_usuario'),
        localStorage.removeItem('@RCA_APP:selected_client'),
        localStorage.removeItem('localTime')
      ]);

      setEmail('');
      setTaxVat('');
      setRcaSaldoFlex(null);
      setCustomer({} as CustomerDataProps);
    }

    setIsSignedIn(false);
    if (connectivityStatus !== 'offline') window.location.reload();
  }, [connectivityStatus]);

  useEffect(() => {
    if (!customer) signOut();
  }, [errorCustomer, loadingCustomer, customer, signOut]);
  
  return (
    <UserContext.Provider
      value={{
        email,
        taxVat,
        customer,
        userToken,
        isSignedIn,
        dashboards,
        valorMinimo,
        rcaSaldoFlex,

        signOut,
        setEmail,
        setTaxVat,
        setIsSignedIn,
        getCustomer,
        setCustomer,
        setRcaSaldoFlex,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

export { UserProvider, useUserContext };
