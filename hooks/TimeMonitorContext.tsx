import { getOnStorage } from '@/shared';
import { useUserContext } from './userContext/UserContext';
import { useNetworkStatusContext } from './NetworkStatusContext';
import { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';

type TimeMonitorContextType = {
    deviceTime: Date;
    localTime: Date | undefined;
    offline: boolean;
    showSameDayModal?: boolean;
    setShowSameDayModal: React.Dispatch<React.SetStateAction<boolean>>;
    showManualTimeChangeModal: boolean;
    setShowManualTimeChangeModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const TimeMonitorContext = createContext<TimeMonitorContextType>({} as TimeMonitorContextType);

const TimeMonitorProvider: React.FC<any> = ({ children }) => {
    const { connectivityStatus } = useNetworkStatusContext();
    const { signOut, isSignedIn } = useUserContext();

    const [deviceTime, setDeviceTime] = useState(new Date());
    const [localTime, setLocalTime] = useState<Date>();
    const [offline, setOffline] = useState(!navigator.onLine);

    const [showSameDayModal, setShowSameDayModal] = useState(false);
    const [showManualTimeChangeModal, setShowManualTimeChangeModal] = useState(false);

    // Função para verificar se a data de login é no mesmo dia
    const verifyLoginDate = useCallback((localTime: Date | undefined) => {
        if (!localTime && !deviceTime) return;
        if (isSignedIn) {
            const dataLogin = getOnStorage('login_date');
            if (dataLogin && connectivityStatus !== 'offline') {
                const loginDate = new Date(dataLogin);
                const isSameDay = (date1: Date, date2: Date) => {
                    return date1.getFullYear() === date2.getFullYear() &&
                        date1.getMonth() === date2.getMonth() &&
                        date1.getDate() === date2.getDate();
                };

                if (!isSameDay(loginDate, deviceTime)) {
                    setShowSameDayModal(true);
                }
            }
        }
    }, [connectivityStatus, deviceTime, isSignedIn]);

    const checkTimeChange = useCallback(() => {
        const currentDeviceTime = new Date().getTime();
        const storedDeviceTime = new Date(localStorage.getItem('localTime') || new Date().getTime()).getTime();

        const timeTolerance = 30 * 60 * 1000; //10 minutos 

        // if (Math.abs(currentDeviceTime - storedDeviceTime) > timeTolerance) {
        //     setShowManualTimeChangeModal(true);
        // }

        const newDeviceTime = new Date();
        if (newDeviceTime.getTime() !== currentDeviceTime) {
            setDeviceTime(newDeviceTime);
        }
    }, []);

    const fetchLocalTime = async () => {
        const savedLocalTime = localStorage.getItem('localTime');
        const savedTimestamp = localStorage.getItem('timeFetchTimestamp');
        const now = new Date().getTime();

        const cacheDuration = 10 * 60 * 1000; // 10 minutos de cache
        if (savedLocalTime && savedTimestamp && now - parseInt(savedTimestamp) < cacheDuration) {
            return new Date(savedLocalTime);
        }

        try {
            const response = await fetch(`https://worldtimeapi.org/api/ip`);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const localTime = new Date(data.datetime);

            localStorage.setItem('localTime', localTime.toISOString());
            localStorage.setItem('timeFetchTimestamp', now.toString());

            return localTime;
        } catch (error) {
            console.warn('Failed to fetch local time:', error);
            return new Date();
        }
    };

    const saveTimes = (deviceTime: Date, localTime: Date) => {
        localStorage.setItem('deviceTime', deviceTime.toISOString());
        localStorage.setItem('localTime', localTime.toISOString());
        setDeviceTime(deviceTime);
        setLocalTime(localTime);
    };

    const getLocationAndTime = async () => {
        let currentLocalTime;

        if (navigator.geolocation) {
            try {
                navigator.geolocation.getCurrentPosition(async () => {
                    currentLocalTime = await fetchLocalTime();
                    saveTimes(new Date(), currentLocalTime);
                });
            } catch (error) {
                console.error('Failed to get geolocation:', error);
                currentLocalTime = new Date();
                saveTimes(new Date(), currentLocalTime);
            }
        } else {
            console.error('Geolocation not supported by this browser.');
            currentLocalTime = new Date();
            saveTimes(new Date(), currentLocalTime);
        }
    };

    const loadLastSavedTimes = () => {
        const savedDeviceTime = localStorage.getItem('deviceTime');
        const savedLocalTime = localStorage.getItem('localTime');
        if (savedDeviceTime && savedLocalTime) {
            setDeviceTime(new Date(savedDeviceTime));
            setLocalTime(new Date(savedLocalTime));
        }
    };

    useEffect(() => {
        if (isSignedIn) {
            getLocationAndTime(); 
            checkTimeChange();   
        }

        // Atualiza a cada 5 minutos para buscar o tempo da API
        const apiUpdateInterval = setInterval(getLocationAndTime, 10 * 60 * 1000); 
        const timeCheckInterval = setInterval(checkTimeChange, 10 * 60 * 1000); 

        if (connectivityStatus === 'offline') {
            setOffline(true);
            loadLastSavedTimes();
        } else {
            setOffline(false);
            getLocationAndTime();
        }

        // Limpa os intervalos quando o componente for desmontado
        return () => {
            clearInterval(apiUpdateInterval);
            clearInterval(timeCheckInterval);
        };
    }, [signOut, connectivityStatus, isSignedIn, checkTimeChange]);

    useEffect(() => {
        if ((localTime || deviceTime) && isSignedIn) {
            verifyLoginDate(localTime);
        }
    }, [localTime, deviceTime, verifyLoginDate, isSignedIn]);

    useEffect(() => {
        let lastCheckTime = new Date();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isSignedIn) {
                const currentTime = new Date();
                const timeDifference = currentTime.getTime() - lastCheckTime.getTime();

                const timeTolerance = 30 * 60 * 1000; // 30 minutos de tolerância

                if (timeDifference > timeTolerance) {
                    verifyLoginDate(localTime);
                    checkTimeChange(); 
                }

                lastCheckTime = new Date();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [localTime, verifyLoginDate, isSignedIn, checkTimeChange]);

    const contextValue = useMemo(() => {
        return {
            deviceTime,
            localTime,
            offline,
            showSameDayModal,
            setShowSameDayModal,
            showManualTimeChangeModal,
            setShowManualTimeChangeModal
        };
    }, [deviceTime, localTime, offline, showManualTimeChangeModal, showSameDayModal]);

    return (
        <TimeMonitorContext.Provider value={contextValue}>
            {children}
        </TimeMonitorContext.Provider>
    );
};

const useTimeMonitorContext = () => {
    const ctx = useContext(TimeMonitorContext);

    if (!ctx) {
        throw new Error('useTimeMonitor must be used within a TimeMonitorProvider');
    }

    return ctx;
};

export { TimeMonitorProvider, useTimeMonitorContext };
