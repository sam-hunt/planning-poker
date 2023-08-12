import { useEffect } from 'react';

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMountEffect = (func: (...args: any[]) => any) => useEffect(func, []);
