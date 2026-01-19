/**
 * Simple storage utility for non-reactive access to localStorage.
 * Useful in actions, utilities, or outside React components.
 */
export const storage = {
    get: <T>(key: string, defaultValue: T): T => {
        if (typeof window === 'undefined') return defaultValue;

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return defaultValue;
        }
    },

    set: <T>(key: string, value: T): void => {
        if (typeof window === 'undefined') return;

        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    },

    remove: (key: string): void => {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(key);
    },

    clear: (): void => {
        if (typeof window === 'undefined') return;
        window.localStorage.clear();
    }
};
