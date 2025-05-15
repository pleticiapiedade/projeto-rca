import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getOnStorage } from '@/shared';

type NetworkStatus = 'offline' | 'online';
interface ConnectivityContextProps {
  connectivityStatus: NetworkStatus;
  updateConnectivityStatus: (status: NetworkStatus) => void;
}

const getOnLineStatus = () =>
  typeof window.navigator !== 'undefined' && typeof window.navigator.onLine === 'boolean'
      ? window.navigator.onLine
      : true;

const NetworkStatusContext = createContext<ConnectivityContextProps>({} as ConnectivityContextProps);

const NetworkStatusProvider: React.FC<any> = ({ children }) => {

  const [connectivityStatus, setConnectivityStatus]= useState<NetworkStatus>(() => {
    const status = getOnLineStatus();
    if (status) return 'online';
    return 'offline';
  });

  window.addEventListener('online', (e) => {
    console.log('online dentro de context: ', e);
    setConnectivityStatus('online');
  });

  window.addEventListener('offline', (e) => {
    console.log('offline dentro de context: ', e);
    setConnectivityStatus('offline');
  });

  const fetchConnectivityStatus = useCallback(() => {
    const status = getOnLineStatus();
    if (status) {
      setConnectivityStatus('online');
      return;
    } 
    setConnectivityStatus('offline');
  }, []);

  const updateConnectivityStatus = useCallback((status: NetworkStatus) => {
    setConnectivityStatus(status);
  }, []);

  const connectivityRef = useRef(getOnStorage("network_status") as 'online' | 'offline');

  useEffect(() => {
    const status = getOnStorage("network_status");
    if (status && connectivityRef.current !== connectivityStatus && connectivityRef.current !== undefined && connectivityRef.current !== status) {
      console.log('entrei>>>');
      if (status) {
        setConnectivityStatus(status);
        connectivityRef.current = status;
      } else {
        setTimeout(() => (fetchConnectivityStatus()), 500);
      }
      // if (status) 
    }
  }, [connectivityStatus, fetchConnectivityStatus]);

  const contextValue = useMemo(() => {
    return {
      connectivityStatus,
      updateConnectivityStatus,
    }
  }, [connectivityStatus, updateConnectivityStatus]);

  return (
    <NetworkStatusContext.Provider value={contextValue}>
      {children}
    </NetworkStatusContext.Provider>
  )
}

const useNetworkStatusContext = () => {
  const ctx = useContext(NetworkStatusContext);

  if (!ctx) throw new Error("Erro ao usar hook Connectivity Context");

  return ctx;
}

export { NetworkStatusProvider, useNetworkStatusContext };