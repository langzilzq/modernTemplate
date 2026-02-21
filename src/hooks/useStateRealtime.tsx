import { useState, useRef, Dispatch, useCallback } from 'react';

function useStateRealtime<T>(initVal: T | (() => T)): [T, Dispatch<T>, () => T] {
  const [val, setVal] = useState(initVal);
  const valRef = useRef(initVal);
  const setState = useCallback((newVal: T) => {
    valRef.current = newVal;
    setVal(newVal);
  }, []);
  const getRealState = useCallback(() => valRef.current, []) as () => T;
  return [val, setState, getRealState];
}

export default useStateRealtime;
