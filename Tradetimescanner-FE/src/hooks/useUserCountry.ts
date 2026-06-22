import { useState, useEffect } from 'react';

export const useUserCountry = () => {
    const [countryCode, setCountryCode] = useState<string | null>(localStorage.getItem('user_country_code'));
    const [isNigeria, setIsNigeria] = useState<boolean>(localStorage.getItem('user_country_code') === 'NG');
    const [loading, setLoading] = useState<boolean>(!countryCode);

    useEffect(() => {
        const fetchCountry = async () => {
            if (countryCode) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                const code = data.country_code;
                
                setCountryCode(code);
                setIsNigeria(code === 'NG');
                localStorage.setItem('user_country_code', code);
            } catch (error) {
                console.error('Error fetching country:', error);
                // Fallback: if we can't detect, we might want to default to hiding it or showing it
                // The user said "should only work with geolocation available country"
                setIsNigeria(false); 
            } finally {
                setLoading(false);
            }
        };

        fetchCountry();
    }, [countryCode]);

    return { countryCode, isNigeria, loading };
};
