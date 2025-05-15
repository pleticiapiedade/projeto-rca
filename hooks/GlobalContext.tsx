import { getOnStorage, setOnStorage } from '@/shared';
import { CardMode, PaymentConditionsProps } from '@/types';
import pacote from '../../package.json';
import { useClient } from './ClientContext';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface HookProps {
  getDate: any;
  version: string;
  resetAccess: any;
  lastSync: string;
  routeTitle: string;
  paymentCode: number;
  fatherRouteTitle: string;
  cardMode: 'list' | 'grid';
  canAccessSuccess: boolean;
  canAccessCheckout: boolean;
  lastCheckedVersion: string;
  isOpenedResetPasswordModal: boolean;
  activeTheme?: any;
  orderData: any;
  cartTotals: any;
  orderItems: any;

  setVersion: (value: string) => void;
  setLastSync: (value: string) => void;
  setRouteTitle: (value: string) => void;
  setPaymentCode: (value: number) => void;
  setFatherRouteTitle: (value: string) => void;
  setCardMode: (value: 'list' | 'grid') => void;
  setCanAccessSuccess: (value: boolean) => void;
  setCanAccessCheckout: (value: boolean) => void;
  setLastCheckedVersion: (value: string) => void;
  setIsOpenResetPasswordModal: (value: boolean) => void;
  setActiveTheme?: (value: any) => void;
  setOrderData: (value: any) => void;
  setCartTotals: (value: any) => void;
  setOrderItems: (value: any) => void;
}

const ConfigsContex = createContext<HookProps>({} as HookProps);

const GlobalProvider: React.FC<any> = ({ children }) => {
  const { selectedClient: client } = useClient();
  const [version, setHookVersion] = useState(pacote.version);
  const [routeTitle, setHookRouteTitle] = useState('');
  const [paymentCode, setHookPaymentCode] = useState(getOnStorage('paymentCode')?.[client?.COD_CLIENTE] || 14);
  const [fatherRouteTitle, setHookFatherTitle] = useState('');
  const [isOpenedResetPasswordModal, setIsOpenResetPasswordModal] = useState(false);
  
  const [cardMode, setHookCardMode] = useState(() => getOnStorage('cardMode') ?? 'list' as CardMode);
  const [lastSync, setHookLastSync] = useState(() => getOnStorage('lastSync') ?? 'Nenhuma atualização');
  const [lastCheckedVersion, setHookLastCheckedVersion] = useState(() => getOnStorage('lastCheckedVersion') ?? '');

  const [activeTheme, setActiveTheme] = useState<any>(null);

  const [orderData, setOrderData] = useState<any>(null);
  const [cartTotals, setCartTotals] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any>(null);

  const [canAccessCheckout, setCanAccessCheckout] = useState(false);
  const [canAccessSuccess, setCanAccessSuccess] = useState(false);

  const setRouteTitle = useCallback(
    (title: string) => setHookRouteTitle(title),
    [setHookRouteTitle]
  );

  const setPaymentCode = useCallback(
    (value: number) => {
      setHookPaymentCode(value)
      const paymentCodes = getOnStorage('paymentCode') || {};
      setOnStorage('paymentCode', { ...paymentCodes, [client.COD_CLIENTE]: value })
    },
    [setHookPaymentCode, client.COD_CLIENTE]
  );

  const setVersion = useCallback(
    (version: string) => setHookVersion(version),
    [setHookVersion]
  );

  const setLastSync = useCallback(
    (lastSync: string) => {
      setHookLastSync(lastSync);
      setOnStorage('lastSync', lastSync);
    },
    [setHookLastSync]
  );

  const setFatherRouteTitle = useCallback(
    (fatherTitle: string) => setHookFatherTitle(fatherTitle),
    [setHookFatherTitle]
  );

  const setCardMode = useCallback(
    (cardMode: CardMode) => {
      setHookCardMode(cardMode);
      setOnStorage('cardMode', cardMode);
    },
    [setHookCardMode]
  );

  const setLastCheckedVersion = useCallback(
    (lastCheckedVersion: string) => {
      setHookLastCheckedVersion(lastCheckedVersion);
      setOnStorage('lastCheckedVersion', lastCheckedVersion);
    },
    [setHookLastCheckedVersion]
  );

  useEffect(() => {
    if (!client?.COD_CLIENTE) return;
    const paymentCode = getOnStorage('paymentCode')?.[client?.COD_CLIENTE] || client?.COD_CONDICAO_PADRAO || client?.COD_PAGAMENTO?.[0]?.cod_condicao || 14;
    if (client?.COD_PAGAMENTO.some((p) => p.cod_condicao === paymentCode)) {
      setHookPaymentCode(paymentCode);
      return
    }
    setHookPaymentCode(client?.COD_PAGAMENTO?.[0]?.cod_condicao || 14);
  }, [client]);

  const resetAccess = () => {
    setCanAccessCheckout(false);
    setCanAccessSuccess(false);
  };

  const addZero = (numero: number) => (numero < 10 ? `0${numero}` : numero);

  const getDate = () => {
    const agora = new Date();
    const dia = addZero(agora.getDate());
    const mes = addZero(agora.getMonth() + 1); // Os meses em JavaScript são baseados em zero
    const ano = agora.getFullYear();
    const horas = addZero(agora.getHours());
    const minutos = addZero(agora.getMinutes());

    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
  };

  return (
    <ConfigsContex.Provider
      value={{
        paymentCode,
        setPaymentCode,
        canAccessCheckout,
        canAccessSuccess,

        getDate,
        lastSync,
        setLastSync,

        version,
        setVersion,

        cardMode,
        setCardMode,

        routeTitle,
        setRouteTitle,

        fatherRouteTitle,
        setFatherRouteTitle,

        setCanAccessCheckout,
        setCanAccessSuccess,
        resetAccess,

        isOpenedResetPasswordModal,
        setIsOpenResetPasswordModal,

        lastCheckedVersion,
        setLastCheckedVersion,

        activeTheme,
        setActiveTheme,

        orderData,
        setOrderData,
        cartTotals,
        setCartTotals,
        orderItems,
        setOrderItems,
      }}
    >
      {children}
    </ConfigsContex.Provider>
  );
};

const useGlobals = (): HookProps => {
  const ctx = useContext(ConfigsContex);

  if (!ctx) throw new Error('Erro ao usar hook Header');

  return ctx;
};

export { GlobalProvider, useGlobals };
