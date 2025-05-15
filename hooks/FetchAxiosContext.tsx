import { getOnStorage, removeFromStorage } from "@/shared";
import { deleteDB } from "@/talons/dbFunctions/useDBFunctions";
import axios, { AxiosInstance } from "axios";
import { useContext, createContext } from "react";
import { useNetworkStatusContext } from "./NetworkStatusContext";

interface HookProps {
  axiosCtx: AxiosInstance;
}

const Auth = () => `Bearer ${getOnStorage("token_aws")}`;

const FetchAxiosContex = createContext<HookProps>({} as HookProps);


const FetchProvider: React.FC<any> = ({ children }) => {
  const { connectivityStatus } = useNetworkStatusContext();

  // console.log(window.agp_config, 'window.agp__config')

  const axiosInstance = axios.create({
    baseURL: window.agp_config.REACT_APP_AWS,
    headers: { Authorization: Auth() },
  });

  axiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = Auth();
    return config;
  });

  axiosInstance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    const regex4XX = /4(0[1-3]|0[5-9]|00|[1-9][01-9])/gm;
    const regex5XX = /5(0[1-9]|00|[1-9][01-9])/gm;

    const statusCode = error?.status?.toString();
    if (connectivityStatus === 'online') {
      if (
        (error?.status && statusCode?.match(regex4XX)) ||
        error?.message?.toLowerCase()?.includes('unauthorized') ||
        error?.message?.toLowerCase()?.includes('expired')
      ) {
        removeFromStorage('login_date');
        removeFromStorage('token_magento');
        removeFromStorage('token_aws');
        removeFromStorage('rca');
        removeFromStorage('selected_client');
        removeFromStorage('datasets');
        removeFromStorage('discounts');
        removeFromStorage('rca_usuario');
        removeFromStorage('cart_id');
        deleteDB();
        alert('Sessão expirada. Por favor, entre com sua conta novamente.');
        window.location.reload();
      }
    }
    if (error?.status && statusCode?.match(regex5XX)) {
      console.log(`Erro status ${error.status}: `, error);
    }
    return Promise.reject(error);
  });

  return (
    <FetchAxiosContex.Provider value={{ axiosCtx: axiosInstance }}>
      {children}
    </FetchAxiosContex.Provider>
  );
};

const useFetchAxios = (): HookProps => {
  const ctx = useContext(FetchAxiosContex);

  if (!ctx) throw new Error("Erro ao usar hook Header");

  return ctx;
};

export { FetchProvider, useFetchAxios };
