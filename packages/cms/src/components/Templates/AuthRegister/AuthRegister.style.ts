import styled from '@emotion/styled';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';



export const AuthRegisterForm = styled.form`
    padding: 40px 12px;
    margin: 40px auto;

    @media (min-width: 1400px) {
        max-width: 746px;
    }

    @media (max-width: 1200px) {
        margin: 0px auto;
    }
    
    @media (max-width: 992px) {
        max-width: 696px;
    }
    
    @media (max-width: 768px) {
        max-width: 516px;
    }
    
    @media (max-width: 600px) {
        max-width: 100%;
    }
`;

export const AuthRegisterGrid = styled(Grid)`
    margin: 0;  
    max-width: 926px;
    box-shadow: 0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%);
    padding: 40px 40px 40px 16px;
    border-radius: 4px;
    display: flex;
    align-items: flex-start;
    margin: 0 auto;

    @media (min-width: 466px) {
        width: 100%
    }
`;

export const AuthRegisterTypography = styled(Typography)`
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
`;

export const AuthRegisterTextField = styled(TextField)`
    .css-1wc848c-MuiFormHelperText-root {
        margin-left: 0;
    }
`

export const AuthRegisterFormControlLabel = styled(FormControlLabel)`
.css-ahj2mt-MuiTypography-root {
        font-size: 14px;
    }
`