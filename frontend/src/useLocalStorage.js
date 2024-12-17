import { useState } from "react";

/**
 * Custom React hook that synchronizes a state variable with local storage.
 *
 * @param {string} key - The key under which the value is stored in local storage.
 * @param {*} initialValue - The initial value to use if no value is found in local storage.
 * @returns {[*, function]} - Returns the current stored value and a function to update it.
 */

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        console.log("fetching token from local storage");
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue];
};

export default useLocalStorage;
