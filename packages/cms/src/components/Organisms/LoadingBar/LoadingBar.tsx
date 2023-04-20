import { Grid, LinearProgress, useTheme } from "@mui/material";

function LoadingBar() {
  const theme = useTheme();

  return (
    <LinearProgress
      classes={{
        colorPrimary: theme.palette.primary.main,
        barColorPrimary: theme.palette.primary.light,
      }}
      sx={{ width: '100%' }}
    />
  );
}

export default LoadingBar;