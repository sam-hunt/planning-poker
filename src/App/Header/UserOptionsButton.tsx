import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import { UserOptionsDialog } from './UserOptionsDialog';
import { useRoom } from '../../hooks/use-room';

export const UserOptionsButton = () => {
  const { userOptions } = useRoom();

  const [isUserOptionsDialogOpen, setIsUserOptionsDialogOpen] = useState(false);
  const openUserOptionsDialog = () => setIsUserOptionsDialogOpen(true);
  const closeUserOptionsDialog = () => setIsUserOptionsDialogOpen(false);

  const showUserOptionsDialog = !userOptions.name || isUserOptionsDialogOpen;

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
