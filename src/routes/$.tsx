import { useNavigate } from '@modern-js/runtime/router';
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true });
  }, []);

  return null;
};

export default Index;
