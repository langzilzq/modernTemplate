import { useNavigate } from '@modern-js/runtime/router';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container-box" onClick={() => navigate('/')}>
      user
    </div>
  );
};

export default Index;
