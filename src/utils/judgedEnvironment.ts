export const isBrowser: boolean = typeof window === 'object';

export function isFirstTime(key: string): boolean {
  if (!isBrowser) {
    return false;
  }
  return !localStorage.getItem(key);
}

export function setFirstTime(key: string, value: '1' | '0' | 'true' | 'false' = '1'): void {
  isBrowser && localStorage.setItem(key, value);
}

export const isDev: boolean = process.env.NODE_ENV === 'development';
