import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { useRoom } from '../../hooks/use-room';
import { UserOptions } from '../RoomPage/RoomProvider';
import { SetUserOptionsCommand, RoomCommands } from '@planning-poker/protocol';

interface UserOptionsDialogProps {
  onClose: () => void;
}

export const UserOptionsDialog = ({ onClose }: UserOptionsDialogProps) => {
  const { userOptions, sendCommand } = useRoom();
  const { control, handleSubmit, watch } = useForm<UserOptions>({ defaultValues: userOptions });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const canClose = userOptions.name.length > 0;

  const onSubmit: SubmitHandler<UserOptions> = newUserOptions => {
    setIsSubmitting(true);
    const setUserOptionsCommand: SetUserOptionsCommand = {
      event: RoomCommands.SetUserOptions,
      ts: new Date().toISOString(),
      ...newUserOptions,
    };
    sendCommand(setUserOptionsCommand);
    onClose();
  };

  const NAME_MAX_LENGTH = 24;

  return (
    <Dialog
      keepMounted={false}
      open={true}
      onClose={(_, reason) => {
        if (['backdropClick', 'escapeKeyDown'].includes(reason) && !canClose) return;
        onClose();
      }}
      aria-labelledby="user-settings-dialog-title"
      aria-describedby="user-settings-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="user-settings-dialog-title" variant="h4" display="flex" alignItems="end" gap={2}>
        <ManageAccountsOutlinedIcon sx={{ width: '48px', height: '48px' }} />
        {'User options'}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <form id="user-options-form" onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Controller
              name="name"
              control={control}
              rules={{
                required: { value: true, message: 'Please enter a display name' },
                maxLength: { value: NAME_MAX_LENGTH, message: 'Name must fit on a card' },
              }}
              render={({ field, fieldState }) => (
                <FormControl error={Boolean(fieldState.error)}>
                  <TextField
                    label="Display name"
                    required
                    {...field}
                    onBlur={() => {
                      field.onChange(field.value.trim());
                      field.onBlur();
                    }}
                    slotProps={{
                      input: {
                        required: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography color={fieldState.error ? 'error' : 'inherit'}>
                              {`${watch('name').length.toString()}/${NAME_MAX_LENGTH.toString()}`}
                            </Typography>
                          </InputAdornment>
                        ),
                      },
                    }}
                    size="small"
                    sx={{ mt: 1 }}
                    fullWidth
                    error={Boolean(fieldState.error)}
                  />
                  <Typography color="error">{fieldState.error?.message ?? <br />}</Typography>
                </FormControl>
              )}
            />
            <Controller
              name="isSpectating"
              control={control}
              render={({ field }) => (
                <FormControl sx={{ width: { xs: '100%', sm: '50%' } }}>
                  <FormControlLabel control={<Switch checked={field.value} {...field} />} label="Spectator mode" />
                </FormControl>
              )}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          type="submit"
          form="user-options-form"
          variant="contained"
          color="primary"
          endIcon={<SaveOutlinedIcon />}
          loadingPosition="end"
          loading={isSubmitting}
        >
          Save
        </LoadingButton>
        {Boolean(userOptions.name) && (
          <Button onClick={onClose} variant="outlined" color="warning">
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
