
import Grid from '@mui/material/Grid';

function MyGrid( props: any ) {
    return (
        <Grid style={{ paddingLeft: props.onRight ? '12px' : 0, paddingRight: props.onLeft ? '12px' : 0 }} {...props} />
    )
}

export default MyGrid
