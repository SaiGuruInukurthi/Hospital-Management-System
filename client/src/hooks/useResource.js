import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';

export default function useResource(path, key, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(path);
      setData(response.data[key] || response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || `Could not load ${key}`);
    } finally {
      setLoading(false);
    }
  }, [key, path]);

  useEffect(() => {
    if (!options.skip) load();
  }, [load, options.skip]);

  return { data, loading, reload: load, setData };
}
