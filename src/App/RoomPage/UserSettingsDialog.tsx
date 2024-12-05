import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Checkbox, FormControlLabel, InputAdornment, Stack, TextField } from '@mui/material';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import { useState } from 'react';
import type { ChangeEventHandler } from 'react';

interface UserSettingsDialogProps {
  isOpen: boolean;
  username: string;
  isSpectating: boolean;
  onChange: (newUsername: string, newIsSpectating: boolean) => void;
  onClose: () => void;
}

export const UserSettingsDialog = ({ isOpen, username, isSpectating, onChange, onClose }: UserSettingsDialogProps) => {
  const [newUsername, setNewUsername] = useState(username);
  const [newIsSpectating, setNewIsSpectating] = useState(isSpectating);

  const onTextChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = event => setNewUsername(event.target.value.slice(0, 16));

  const onClickDone = () => {
    onChange(newUsername.slice(0, 16), newIsSpectating);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={(_, reason) => {
        if (!['backdropClick', 'escapeKeyDown'].includes(reason)) onChange(newUsername, newIsSpectating);
        onClose();
      }}
      aria-labelledby="user-settings-dialog-title"
      aria-describedby="user-settings-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="user-settings-dialog-title" variant="h4" display="flex" alignItems="end" gap={2}>
        <ManageAccountsOutlinedIcon sx={{ width: '48px', height: '48px' }} />
        {'User Settings'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            label="Name"
            value={newUsername}
            variant="standard"
            InputProps={{
              required: true,
              endAdornment: (
                <InputAdornment position="end">
                  {newUsername.length}
                  /16
                </InputAdornment>
              ),
            }}
            onChange={onTextChange}
            size="small"
            sx={{ mr: 1 }}
            fullWidth
          />
          <FormControlLabel
            control={<Checkbox checked={newIsSpectating} onChange={event => setNewIsSpectating(event.target.checked)} />}
            label="Enable spectator mode"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickDone} variant="contained" color="primary">
          Save
        </Button>
        <Button onClick={onClose} color="warning">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
