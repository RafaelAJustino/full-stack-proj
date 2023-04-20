import styled from '@emotion/styled';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

export const NewUserGrid = styled(Grid)`
    max-width: 926px;
    box-shadow: 0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%);
    padding: 40px;
    border-radius: 4px;
    display: flex;
    align-items: flex-start;
    margin: 2.5rem auto;
    
    @media (min-width: 466px) {
        width: 100%
    }
`;

export const NewUserTypography = styled(Typography)`
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
`;

export const NewUserTextField = styled(TextField)`
    .css-1wc848c-MuiFormHelperText-root {
        margin-left: 0;
    }
`

export const NewUserFormControlLabel = styled(FormControlLabel)`
.css-ahj2mt-MuiTypography-root {
        font-size: 14px;
    }
`