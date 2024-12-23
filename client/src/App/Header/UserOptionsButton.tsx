import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import { UserOptionsDialog } from './UserOptionsDialog';
import { useRoom } from '../../hooks/use-room';

export const UserOptionsButton = () => {
  const { userOptions } = useRoom();

  const [isUserOptionsDialogOpen, setIsUserOptionsDialogOpen] = useState(false);
  const openUserOptionsDialog = () => setIsUserOptionsDialogOpen(true);
  const closeUserOptionsDialog = () => setIsUserOptionsDialogOpen(false);

  const [mountDialogDelayPassed, setMountDialogDelayPassed] = useState(false);
  useEffect(() => {
    if (userOptions.name) {
      setMountDialogDelayPassed(false);
      return;
    }
    setTimeout(() => setMountDialogDelayPassed(true), 3000);
  }, [userOptions.name]);

  const showUserOptionsDialog = (mountDialogDelayPassed && !userOptions.name) || isUserOptionsDialogOpen;

  return (
    <>
      <Tooltip title="User options">
        <IconButton onClick={openUserOptionsDialog} color="inherit">
          <AccountCircleOutlinedIcon />
        </IconButton>
      </Tooltip>
      {showUserOptionsDialog && <UserOptionsDialog onClose={closeUserOptionsDialog} />}
    </>
  );
};
