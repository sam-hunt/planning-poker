import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';

export interface StopwatchProps {
  since: string;
}

export const Stopwatch: FC<StopwatchProps> = ({ since }) => {
  const ts = useMemo(() => dayjs(since), [since]);
  const [diff, setDiff] = useState<number>(dayjs().diff(ts, 's'));

  useEffect(() => {
    const interval = setInterval(() => setDiff(dayjs().diff(ts, 's')), 1000);
    return () => clearInterval(interval);
  }, [ts]);

  const seconds = diff % 60;
  const ss = seconds.toString().padStart(2, '0');

  const minutes = (diff - seconds) / 60;
  const mm = minutes.toString().padStart(2, '0');

  return <span>{`${mm}:${ss}`}</span>;
};
