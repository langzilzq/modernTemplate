import { useNavigate } from '@modern-js/runtime/router';
import RichText from '@/components/RichText';
import ComAnimation from '@/components/ComAnimation';

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
      <div className="richtext">
        <RichText value="你好" />
      </div>
    </div>
  );
};

export default () => (
  <ComAnimation type="slide" distance={100}>
    <Index />
  </ComAnimation>
);
