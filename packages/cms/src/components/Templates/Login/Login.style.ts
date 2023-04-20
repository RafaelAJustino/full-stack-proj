import styled from '@emotion/styled';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export const LoginMainGrid = styled(Grid)`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 40px 12px;
    margin: 40px auto;

    @media (min-width: 1400px) {
        max-width: 416px
    }

    @media (max-width: 1400px) {
        max-width: 416px
    }

    @media (max-width: 1200px) {  
        margin: 0 auto;
        max-width: 416px
    }

    
    @media (max-width: 768px) {
        max-width: 516px;
    }
    
    @media (max-width: 600px) {
        max-width: 100%;
    }
`;

export const LoginGrid = styled(Grid)`
    width: 100%;
    box-shadow: 0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%);
    padding: 40px;
    border-radius: 4px;
    display: flex;
    gap: 1.5rem;

    @media (min-width: 466px) {
        width: 100%
    }
`;

export const LoginTypography = styled(Typography)`
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    margin-left: 5px;
`;

export const LoginTextField = styled(TextField)`
    .css-1wc848c-MuiFormHelperText-root {
        margin-left: 0;
    }
`