import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Stack, TextField, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

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

  const onClickDone = () => {
    onChange(newUsername);
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
            Set new username
          </Typography>
          <Stack direction="row">
            <TextField fullWidth value={newUsername} onChange={(event) => setNewUsername(event.target.value)} size="small" sx={{ mr: 1 }} />
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
