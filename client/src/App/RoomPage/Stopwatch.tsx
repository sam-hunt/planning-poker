import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

export interface StopwatchProps {
  since: string;
}

export const Stopwatch = ({ since }: StopwatchProps) => {
  const ts = useMemo(() => dayjs(since), [since]);
  const [diff, setDiff] = useState<number>(dayjs().diff(ts, 's'));

  const {
    palette: {
      warning: { main: warn },
      error: { main: error },
    },
  } = useTheme();
  const color = diff > 300 ? error : diff > 180 ? warn : 'inherit';

  useEffect(() => {
    const interval = setInterval(() => setDiff(dayjs().diff(ts, 's')), 1000);
    return () => clearInterval(interval);
  }, [ts]);

  const seconds = diff % 60;
  const ss = seconds.toString().padStart(2, '0');

  const minutes = (diff - seconds) / 60;
  const mm = minutes.toString().padStart(2, '0');

  return <span style={{ color }}>{`${mm}:${ss}`}</span>;
};
