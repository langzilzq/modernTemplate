import { useNavigate } from '@modern-js/runtime/router';
import ComAnimation from '@/components/ComAnimation';
import RichText from '@/components/RichText';

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
      <RichText value="你好" />
    </div>
  );
};

export default () => (
  <ComAnimation type="slide" distance={100}>
    <Index />
  </ComAnimation>
);
