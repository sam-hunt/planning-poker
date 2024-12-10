import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { ReadyState } from 'react-use-websocket';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

import { useRoom } from '../../hooks/use-room';
import { useState } from 'react';

export const ConnectionButton = () => {
  const { readyState } = useRoom();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // TODO: Refactor
  const reload = () => window.location.reload();

  return (
    <Tooltip title={`Websocket ${ReadyState[readyState]}`}>
      <span>
        <IconButton onClick={reload} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          {isHovered ? (
            <RefreshOutlinedIcon />
          ) : (
            <>
              {readyState === ReadyState.UNINSTANTIATED && <ErrorOutlinedIcon color="error" />}
              {readyState === ReadyState.CLOSED && <ErrorOutlinedIcon color="error" />}
              {readyState === ReadyState.CLOSING && <ErrorOutlinedIcon color="error" />}
              {readyState === ReadyState.CONNECTING && <CircularProgress size="24px" />}
              {readyState === ReadyState.OPEN && <CheckCircleOutlineIcon color="success" />}
            </>
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};
