import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import GitHubIcon from '@mui/icons-material/GitHub';

export const OpenGithubButton = () => (
  <Tooltip title="Open on Github">
    <IconButton onClick={() => window.open('https://github.com/sam-hunt/planning-poker', '_blank')} color="inherit">
      <GitHubIcon />
    </IconButton>
  </Tooltip>
);
