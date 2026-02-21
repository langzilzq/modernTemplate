import { useState, useLayoutEffect } from 'react';
import { isBrowser } from '@/utils';

function useIsMobile(): boolean {
  const [state, setState] = useState(() => !isPc());
  useLayoutEffect(() => {
    let mounted = true;
    const mobile = window?.matchMedia?.('(max-width: 768px)');
    const onChange = () => {
      if (!mounted) {
        return;
      }
      setState(mobile.matches);
    };
    mobile?.addEventListener?.('change', onChange);
    setState(mobile.matches);
    return () => {
      mounted = false;
      mobile?.removeEventListener?.('change', onChange);
    };
  }, []);
  return state;
}

function isPc() {
  const userAgentInfo = isBrowser ? navigator.userAgent : '';
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  let flag = true;
  for (const agent of Agents) {
    if (userAgentInfo.indexOf(agent) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

export default useIsMobile;
