import { useNavigate } from '@modern-js/runtime/router';

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="container-box">
      <div className="title">
        Welcome to
        <img
          className="logo"
          src="https://lf3-static.bytednsdoc.com/obj/eden-cn/zq-uylkvT/ljhwZthlaukjlkulzlp/modern-js-logo.svg"
          alt="Modern.js Logo"
          onClick={() => navigate('/user')}
        />
        <p className="name">Modern.js</p>
      </div>
    </div>
  );
};

export default Index;
