import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { generateSlug } from 'random-word-slugs';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LoginIcon from '@mui/icons-material/Login';
import CasinoIcon from '@mui/icons-material/Casino';
import { useNavigate } from 'react-router';
import { useLocalStorage } from '../../hooks/use-local-storage';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

export const HomePage = () => {
  const randomName = () =>
    generateSlug(3, {
      format: 'title',
      categories: { adjective: ['time', 'color', 'quantity', 'size', 'sounds'], noun: ['food', 'animals', 'time'] },
    });
  const [savedRoomName] = useLocalStorage<string>('planningpoker-roomName', randomName());
  const [copyTooltip, setCopyTooltip] = useState<string>('');
  const navigate = useNavigate();

  interface RoomNameFormData {
    roomName: string;
  }

  const { control, handleSubmit, watch, formState } = useForm<RoomNameFormData>({
    defaultValues: { roomName: savedRoomName },
  });

  const roomSlugFromName = (roomName: string) =>
    roomName
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/-+/g, '-')
      .toLowerCase();

  const roomSlug = roomSlugFromName(watch('roomName'));
  const roomPath = `${window.location.href}${roomSlug}`;

  const onSubmit: SubmitHandler<RoomNameFormData> = async roomNameFormData => {
    const { roomName } = roomNameFormData;
    await navigate(roomSlugFromName(roomName));
  };

  const onCopyClick = async () => {
    await navigator.clipboard.writeText(roomPath);
    setCopyTooltip('Copied!');
    setTimeout(() => setCopyTooltip(''), 1000);
  };

  const [MIN_ROOM_NAME_LENGTH, MAX_ROOM_NAME_LENGTH] = [3, 36];

  return (
    <Dialog open={true} fullWidth maxWidth="sm" hideBackdrop>
      <DialogTitle variant="h3" component="h2" display="flex" gap={3} alignItems="end">
        <CasinoIcon sx={{ width: '64px', height: '64px', alignSelf: 'center' }} />
        {'Planning Poker'}
      </DialogTitle>
      <DialogContent>
        <form id="room-name-form" onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" mt={2}>
            <Typography variant="h5" component="h2" mb={1}>
              Join a room:
            </Typography>
            <Controller
              name="roomName"
              control={control}
              rules={{
                required: { value: true, message: 'Please enter a room name' },
                minLength: { value: MIN_ROOM_NAME_LENGTH, message: 'Room name should make a memorable URL' },
                maxLength: { value: MAX_ROOM_NAME_LENGTH, message: 'Room name should make a memorable URL' },
              }}
              render={({ field, fieldState }) => (
                <FormControl error={Boolean(fieldState.error)}>
                  <TextField
                    {...field}
                    onChange={event => field.onChange(event.target.value.replace(/[\s]+/g, ' ').replace(/-+/g, '-'))}
                    fullWidth
                    size="small"
                    placeholder="Room name"
                    error={Boolean(fieldState.error)}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <IconButton size="small" onClick={() => field.onChange(randomName())}>
                            <CasinoIcon />
                          </IconButton>
                        ),
                      },
                    }}
                  />
                  <Typography color="error">{fieldState.error?.message ?? <br />}</Typography>
                </FormControl>
              )}
            />
            {formState.isValid ? (
              <Link href={`/${roomSlug}`} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" sx={{ lineClamp: 1 }}>
                {roomPath}
              </Link>
            ) : (
              <Typography color="textDisabled" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" sx={{ lineClamp: 1 }}>
                {roomPath}
              </Typography>
            )}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Tooltip title={!formState.isValid ? 'Please enter a valid room name' : copyTooltip}>
          <span>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<ContentCopyIcon />}
              onClick={onCopyClick}
              onMouseLeave={() => setCopyTooltip('')}
              disabled={!formState.isValid}
            >
              Copy link
            </Button>
          </span>
        </Tooltip>
        <Button type="submit" form="room-name-form" variant="contained" color="primary" endIcon={<LoginIcon />}>
          Join room
        </Button>
      </DialogActions>
    </Dialog>
  );
};
