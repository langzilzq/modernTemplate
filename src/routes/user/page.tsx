import { useNavigate } from '@modern-js/runtime/router';
import ComAnimation from '@/components/ComAnimation';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container-box" onClick={() => navigate('/')}>
      user
    </div>
  );
};

export default () => (
  <ComAnimation type="slide" distance={100}>
    <Index />
  </ComAnimation>
);
