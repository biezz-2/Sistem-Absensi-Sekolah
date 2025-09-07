
import { useState, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({ latitude: null, longitude: null });
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            const err = "Geolocation is not supported by your browser";
            setError(err);
            reject(err);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                setError(null);
                resolve({ latitude, longitude });
            },
            (err) => {
                const errMsg = `Error getting location: ${err.message}`;
                setError(errMsg);
                reject(errMsg);
            }
        );
    });
  }, []);

  return { location, error, getLocation };
};
