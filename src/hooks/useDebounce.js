import { useState, useEffect } from 'react';

export function useDebounce(value, delay){

    const [debouncedValue, setDebouncedValue] = useState('');

    useEffect(() => {

        const timed = setTimeout(() => {
            setDebouncedValue(value);
        });

        return () => {
            clearTimeout(timed);
        }
    }, [value]);

    return debouncedValue;
    
};