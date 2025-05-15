import { useTables } from './TablesContext';
import { getOnStorage, removeFromStorage, setOnStorage } from '@/shared';
import { useState, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { ClientProps, ClientAddressProps, CampanhaProdutosProps, CampanhaClientesProps } from '@/types';

interface HookProps {
  janelaEntregaData: any;
  allClients: ClientProps[];
  selectedClient: ClientProps;
  campanhaProdutos: CampanhaProdutosProps;
  campanhaClientes: CampanhaClientesProps;
  campanhaTopMix: any;
  campanhaFaixa: any;
  selectedClientAddress: ClientAddressProps;
  indicadorLoja: any;
  indicadoresProdutividade: any;

  // loadClients: () => void;
  logoutClient: () => void;
  calculateDeliveryDate: () => string;
  setJanelaEntregaData: (data: any) => void;
  // setAllClients: (clients: ClientProps[]) => void;
  setSelectedClient: (client: ClientProps) => void;
  setCampanhaClientes: (campanha: CampanhaClientesProps) => void;
  setCampanhaProdutos: (campanha: CampanhaProdutosProps) => void;
  setPositivacao: (mode: 'produto' | 'cliente', ids: number[]) => void;
  setCampanhaTopMix: (campanha: any) => void;
  setCampanhaFaixa: (campanha: any) => void;
  setIndicadorLoja: (indicador: any) => void;
  setIndicadoresProdutividade: (indicadores: any) => void;
}

const ConfigsContex = createContext<HookProps>({} as HookProps);

const reduceLsit = (list?: number[]) => list?.reduce((acc, p) => ({ [p]: p, ...acc }), {}) || {};

const ClientProvider: React.FC<any> = ({ children }) => {
  const {tables} = useTables();
  const client = getOnStorage('selected_client');
  
  const [janelaEntrega] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [campanhaFaixa, setHookCampanhaFaixa] = useState<any>(null);
  const [indicadorLoja, setHookIndicadorLoja] = useState<any>(null);
  const [campanhaTopMix, setHookCampanhaTopMix] = useState<any>(null);
  const [janelaEntregaData, setJanelaEntregaData] = useState<any>(null);
  const [hookSelectedClient, setHookSelectedClient] = useState(getOnStorage('selected_client') || {} as ClientProps);
  const [indicadoresProdutividade, setHookIndicadoresProdutividade] = useState<any>(null);
  const [campanhaClientes, setHookCampanhaClientes] = useState({} as CampanhaClientesProps);
  const [campanhaProdutos, setHookCampanhaProdutos] = useState({} as CampanhaProdutosProps);
  const [selectedClientAddress, setSelectedClienteAddress] = useState({} as ClientAddressProps);

  const selectedClient = useMemo(() => {
    const clientHook = {...(hookSelectedClient || {})};
    clientHook.COD_PAGAMENTO = clientHook?.COD_PAGAMENTO?.sort((a, b) => a.cod_condicao - b.cod_condicao) || [];
    return clientHook
  }, [hookSelectedClient]);

  const calculateDeliveryDate = useCallback(() => {
    const cod_rota = client?.COD_ROTA;
    const days = {
      1: 'Domingo',
      2: 'Segunda-feira',
      3: 'Terça-feira',
      4: 'Quarta-feira',
      5: 'Quinta-feira',
      6: 'Sexta-feira',
      7: 'Sábado',
    };

    const janelasEntrega = janelaEntrega?.filter((row: any) => row.COD_ROTA === cod_rota);
    if (!janelasEntrega?.length) {
      return 'Nenhuma janela de entrega disponível no momento.';
    }

    const now = new Date();
    const weekDayNow = now.getDay();
    const hour = now.getHours();

    const weekDay = weekDayNow === 0 ? 7 : weekDayNow;

    for (const janela of janelasEntrega) {
      const initialDay = janela.DIA_INT_INICIAL;
      const initialHour = janela.HORA_INT_INICIAL;
      const finalDay = janela.DIA_INT_FINAL;
      const finalHour = janela.HORA_INT_FINAL;

      const isWithinRange =
        (weekDay > initialDay || (weekDay === initialDay && hour >= initialHour)) &&
        (weekDay < finalDay || (weekDay === finalDay && hour < finalHour));

      if (isWithinRange) {
        // console.log(`Data prevista de entrega: ${janela.DATA_PREVISTA_ENTREGA} (${days[initialDay as keyof typeof days]})`)
        return `Data prevista de entrega: ${janela.DATA_PREVISTA_ENTREGA} (${days[initialDay as keyof typeof days]})`;
      }
    }
    return 'Nenhuma janela de entrega disponível no momento.';
  }, [client, janelaEntrega]);

  const setSelectedClient = useCallback(
    (newClient: ClientProps) => {
      setOnStorage('selected_client', newClient);
      setHookSelectedClient(newClient);
    },
    [setHookSelectedClient]
  );

  const logoutClient = useCallback(() => {
    removeFromStorage('selected_client');
    setHookSelectedClient({} as ClientProps);
    setSelectedClienteAddress({} as ClientAddressProps);
    localStorage.setItem('@PWA_RCA:selected_client', '');
    setIsLoaded(false);
  }, [setHookSelectedClient]);

  const setCampanhaProdutos = useCallback((campanha: CampanhaProdutosProps) => {
    if (!campanha) return;

    if (campanha?.ativo?.produto) campanha.ativo.ids = reduceLsit(campanha?.ativo?.produto);
    if (campanha?.inativo?.produto) campanha.inativo.ids = reduceLsit(campanha?.inativo?.produto);

    setHookCampanhaProdutos(campanha);
  }, []);

  const setCampanhaClientes = useCallback((campanha: CampanhaClientesProps) => {
    if (!campanha) return;

    if (campanha?.ativo?.clientes) campanha.ativo.ids = reduceLsit(campanha?.ativo?.clientes);
    if (campanha?.inativo?.cliente) campanha.inativo.ids = reduceLsit(campanha?.inativo?.cliente);

    setHookCampanhaClientes(campanha);
  }, []);

  const setCampanhaTopMix = useCallback((campanha: any) => {
    if (!campanha) return;

    setHookCampanhaTopMix(campanha);
  }, []);

  const setCampanhaFaixa = useCallback((campanha: any) => {
    if (!campanha) return;

    setHookCampanhaFaixa(campanha);
  }, []);

  const setIndicadoresProdutividade = useCallback((indicadores: any) => {
    if (!indicadores) return;

    setHookIndicadoresProdutividade(indicadores);
  }, []);

  const setIndicadorLoja = useCallback((indicador: any) => {
    if (!indicador) return;

    setHookIndicadorLoja(indicador);
  }, []);

  const setPositivacao = useCallback((mode: 'produto' | 'cliente', ids: number[]) => {
    // const isProduct = mode === 'produto' 
    // if (isProduct) {
    //   const campanha = {...campanhaProdutos};
    //   campanha.inativo.produto = campanha.inativo.produto.filter((p: number) => !ids.includes(p))
    //   campanha.ativo.produto = [...campanha.ativo.produto, ...ids]

    //   setCampanhaProdutos(campanha)
    //   setOnDB(campanha, 'campanhaProduto')
    //   return
    // }

    // const campanha = {...campanhaClientes};
    // campanha.inativo.cliente = campanha.inativo.cliente.filter((p: number) => !ids.includes(p))
    // campanha.ativo.clientes = [...campanha.ativo.clientes, ...ids]

    // setCampanhaClientes(campanha)
    // setOnDB(campanha, 'campanhaCliente')
    // }, [campanhaProdutos, campanhaClientes, setCampanhaProdutos, setCampanhaClientes, setOnDB]);
  }, []);

  const loadStorageDatas = useCallback(async (client: any) => {
    const clientAddress = {
      street: client.ENDERECO,
      address_number: client.NUMERO,
      region: client.BAIRRO,
      state: client.ESTADO,
      city: client.CIDADE,
      name: client.NM_CLIENTE,
      cep: client.CEP,
      telephone: client.NR_TELEFONE,
    };
    setHookSelectedClient(client);
    setSelectedClienteAddress(clientAddress);

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded && client?.COD_CLIENTE) {
      loadStorageDatas(client);
    }
  }, [isLoaded, client]);

  useEffect(() => {
    const getCampanhas = async () => {
      const campanhaProdutos = tables.current.campanha_produto;
      setCampanhaProdutos(campanhaProdutos);
      const campanhaClientes = tables.current.campanha_cliente;
      setCampanhaClientes(campanhaClientes);
    };

    getCampanhas();
  }, []);

  useEffect(() => {
    if (!indicadorLoja) {
      setIndicadorLoja(tables.current.indicador_loja);
    }
  }, [indicadorLoja]);

  return (
    <ConfigsContex.Provider
      value={{
        campanhaProdutos,
        campanhaClientes,
        allClients: Array.isArray(tables?.current?.cliente) ? tables?.current?.cliente : [],
        selectedClient,
        selectedClientAddress,
        janelaEntregaData,
        campanhaFaixa,
        campanhaTopMix,
        indicadorLoja,
        indicadoresProdutividade,
        // loadClients,
        logoutClient,
        // setAllClients,
        setPositivacao,
        setSelectedClient,
        setCampanhaProdutos,
        setCampanhaClientes,
        setJanelaEntregaData,
        calculateDeliveryDate,
        setCampanhaFaixa,
        setCampanhaTopMix,
        setIndicadorLoja,
        setIndicadoresProdutividade,
      }}
    >
      {children}
    </ConfigsContex.Provider>
  );
};

const useClient = (): HookProps => {
  const ctx = useContext(ConfigsContex);

  if (!ctx) throw new Error('Erro ao usar hook Header');

  return ctx;
};

export { ClientProvider, useClient };
