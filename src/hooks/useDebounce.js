import { useState, useEffect } from 'react';

export function useDebounce(value, delay){

    const [debouncedValue, setDebouncedValue] = useState('');

    useEffect(() => {

        const timed = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timed);
        }
    }, [value]);

    return debouncedValue;
    
};