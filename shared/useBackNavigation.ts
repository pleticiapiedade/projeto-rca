import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { DASHBOARD, ECOMMERCE } from '@/constants/systemRoutes';


const useBackNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const lastPageRef = useRef<string | null>(null);

    useEffect(() => {
        lastPageRef.current = sessionStorage.getItem('lastVisitedPage');
    }, []);

    useEffect(() => {
        const handleNavigation = () => {
            if (lastPageRef.current) {
                sessionStorage.setItem('lastVisitedPage', lastPageRef.current);
            }
            lastPageRef.current = location.pathname;
        };

        if (lastPageRef.current !== location.pathname) {
            handleNavigation();
        }
    }, [location]);

    const goBack = () => {
        const lastVisitedPage = sessionStorage.getItem('lastVisitedPage');
        if (lastVisitedPage === '/checkout') {
            navigate(ECOMMERCE.link);
        // } else if (lastVisitedPage === location.pathname || !lastVisitedPage || location.pathname === '/indicadores') {
        //     navigate(DASHBOARD.link);
        // } else if (lastVisitedPage && lastVisitedPage !== location.pathname) {
        //     navigate(lastVisitedPage);
        } else {
            navigate(-1);
        }
    };

    return { goBack };
};

export default useBackNavigation;

