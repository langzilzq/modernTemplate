import { DependencyList, useCallback, useEffect, useRef } from 'react';

type Noop = (...args: any[]) => any;

export interface ReturnValue<T extends any[]> {
  run: (...args: T) => void;
  cancel: () => void;
}
export interface IUseDebounceFnOptions {
  immediately?: boolean;
  trailing?: boolean;
  leading?: boolean;
}

function useDebounceFn<T extends any[]>(
  fn: (...args: T) => any,
  wait: number = 1000,
  deps: DependencyList = [],
  options: IUseDebounceFnOptions = {}
): ReturnValue<T> {
  const { immediately = false, trailing = true, leading = false } = options;
  const _deps = deps;
  const _wait = wait;
  const timer = useRef<number>();
  const haveRun = useRef(false);
  const interval = useRef(false);
  const fnRef = useRef<Noop>(fn);
  fnRef.current = fn;

  const currentArgs = useRef<any[]>([]);

  const setTimer = (trailing: boolean) => {
    return window.setTimeout(() => {
      trailing && fnRef.current(...currentArgs.current);
      interval.current = false;
    }, _wait);
  };

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  }, []);

  const run = useCallback(
    (...args: any[]) => {
      currentArgs.current = args;
      if (immediately && !haveRun.current) {
        fnRef.current(...currentArgs.current);
        haveRun.current = true;
        return;
      }
      cancel();
      if (leading) {
        if (interval.current === false) {
          fnRef.current(...currentArgs.current);
          interval.current = true;
        }
      }
      timer.current = setTimer(trailing);
    },
    [_wait, cancel]
  );

  useEffect(() => {
    run();
    return cancel;
  }, [..._deps, run]);

  useEffect(() => cancel, []);

  return {
    run,
    cancel
  };
}

export default useDebounceFn;
