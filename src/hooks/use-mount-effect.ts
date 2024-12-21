import { useEffect, EffectCallback } from 'react';

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMountEffect = (func: EffectCallback) => useEffect(func, []);
