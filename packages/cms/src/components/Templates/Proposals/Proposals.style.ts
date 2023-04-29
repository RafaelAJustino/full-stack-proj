import styled from '@emotion/styled';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

export const ListProposalGrid = styled(Grid)`
    margin-left: 0;
    width: 900px;
    box-shadow: 0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 2.5rem auto;

    @media (min-width: 466px) {
        width: 900px;
    }
`;

export const ListProposalSearch = styled(FormControl)`
    height: 33px; 
    margin: 0;

    .css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root {
        height: 33px; 
        padding-right: 5px;
    }

    .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input {
        padding: 5px 15px;
    }

    .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root {
        top: -10px
    }
`;

export const ListProposalTitle = styled(Typography)`
    cursor: pointer;
    font-size: 20px;
    font-weight: 700;
`;

export const ListProposalDescription = styled(Typography)`
    cursor: pointer;
    font-size: 14px;
    opacity: 0.6;
`;


export const ListProposalTableCell = styled(TableCell)`
    padding: 5px;
`;

export const NewUserTextField = styled(TextField)`
    .css-1wc848c-MuiFormHelperText-root {
        margin-left: 0;
    }
`