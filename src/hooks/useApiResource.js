import { useCallback, useEffect, useState } from 'react';
import api from '../lib/api';

export function useApiResource(path, initialValue = [], enabled = true) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(path);
      // Handle different response formats
      const responseData = response.data.data ?? response.data;
      setData(Array.isArray(responseData) ? responseData : (responseData || initialValue));
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load data';
      console.error(`Failed to load ${path}:`, errorMessage);
      setError(errorMessage);
      setData(initialValue);
    } finally {
      setLoading(false);
    }
  }, [path, initialValue]);

  useEffect(() => {
    if (!enabled || !path) {
      setLoading(false);
      setData(initialValue);
      return;
    }

    load();
  }, [path, enabled, load, initialValue]);

  return { data, setData, loading, error, refresh: load };
}