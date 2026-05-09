import { useEffect, useState } from 'react';
import api from '../lib/api';

export function useApiResource(path, initialValue = [], enabled = true) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const response = await api.get(path);
      setData(response.data.data ?? response.data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled || !path) {
      setLoading(false);
      return;
    }

    void load();
  }, [path, enabled]);

  return { data, setData, loading, error, refresh: load };
}