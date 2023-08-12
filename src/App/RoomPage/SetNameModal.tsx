import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, InputAdornment, Modal, Stack, TextField, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import type { ChangeEventHandler } from 'react';

interface SetNameModalProps {
  isOpen: boolean;
  value: string;
  onChange: (newUsername: string) => void;
  onClose: () => void;
}

export const SetNameModal = ({ isOpen, value, onChange, onClose }: SetNameModalProps) => {
  const [newUsername, setNewUsername] = useState(value);
  const theme = useTheme();
  const { modalBoxStyle } = theme.mixins;

  const onTextChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => setNewUsername(event.target.value.slice(0, 16));

  const onClickDone = () => {
    onChange(newUsername.slice(0, 16));
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={(event, reason) => {
        if (!['backdropClick', 'escapeKeyDown'].includes(reason)) onChange(newUsername);
        onClose();
      }}
      aria-labelledby="set-name-modal-title"
      aria-describedby="set-name-modal-description"
    >
      <Box sx={modalBoxStyle}>
        <Stack direction="column" spacing={2}>
          <Typography id="set-name-modal-title" variant="h5" component="h2">
            Set name
          </Typography>
          <Stack direction="row">
            <TextField
              fullWidth
              value={newUsername}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {newUsername.length}
                    /16
                  </InputAdornment>),
              }}
              onChange={onTextChange}
              size="small"
              sx={{ mr: 1 }}
            />
            <IconButton onClick={onClickDone} color="success">
              <CheckIcon />
            </IconButton>
            <IconButton onClick={onClose} color="error">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};
