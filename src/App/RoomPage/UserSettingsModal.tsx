import { Box, Button, Checkbox, Divider, FormControlLabel, InputAdornment, Modal, Stack, TextField, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import type { ChangeEventHandler } from 'react';

interface UserSettingsModalProps {
  isOpen: boolean;
  username: string;
  isSpectating: boolean;
  onChange: (newUsername: string, newIsSpectating: boolean) => void;
  onClose: () => void;
}

export const UserSettingsModal = ({ isOpen, username, isSpectating, onChange, onClose }: UserSettingsModalProps) => {
  const [newUsername, setNewUsername] = useState(username);
  const [newIsSpectating, setNewIsSpectating] = useState(isSpectating);

  const theme = useTheme();
  const { modalBoxStyle } = theme.mixins;

  const onTextChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => setNewUsername(event.target.value.slice(0, 16));

  const onClickDone = () => {
    onChange(newUsername.slice(0, 16), newIsSpectating);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={(event, reason) => {
        if (!['backdropClick', 'escapeKeyDown'].includes(reason)) onChange(newUsername, newIsSpectating);
        onClose();
      }}
      aria-labelledby="user-settings-modal-title"
      aria-describedby="user-settings-modal-description"
    >
      <Box sx={modalBoxStyle}>
        <Stack direction="column" spacing={2}>
          <Typography id="user-settings-modal-title" variant="h5" component="h2">
            User Settings
          </Typography>
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
                </InputAdornment>),
            }}
            onChange={onTextChange}
            size="small"
            sx={{ mr: 1 }}
            fullWidth
          />
          <FormControlLabel
            control={(
              <Checkbox
                checked={newIsSpectating}
                onChange={(event) => setNewIsSpectating(event.target.checked)}
              />
            )}
            label="Enable spectator mode"
          />
          <Divider />
          <Stack direction="row-reverse">
            <Button onClick={onClickDone} variant="contained" color="primary">Save</Button>
            <Box flex={1} />
            <Button onClick={onClose} color="warning">Cancel</Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};
