import styled from '@emotion/styled';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import MyGrid from '../../../Molecules/MyGrid';

export const NewAccessProfileGrid = styled(Grid)`
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

export const NewAccessProfileTypography = styled(Typography)`
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
`;

export const NewAccessProfileTextField = styled(TextField)`
    .css-1wc848c-MuiFormHelperText-root {
        margin-left: 0;
    }
`

export const NewAccessProfileFormControlLabel = styled(FormControlLabel)`
.css-ahj2mt-MuiTypography-root {
        font-size: 14px;
    }
`

export const NewAccessProfileAccordionSummary = styled(AccordionSummary)`
    .css-o4b71y-MuiAccordionSummary-content.Mui-expanded,
    .css-o4b71y-MuiAccordionSummary-content {
        margin: 0;
    }
`;

export const NewAccessProfileGridBts = styled(MyGrid)`
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    alignItems: center;
    
    @media (max-width: 466px) {
        flex-direction: column-reverse;
    }
`;