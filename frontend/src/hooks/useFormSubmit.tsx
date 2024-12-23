import { useState } from 'react';
import axios from 'axios';

export const useFormSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitForm = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post('http://localhost:3000/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading, error, success };
};

