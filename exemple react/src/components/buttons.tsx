import { Box } from "@mui/material";

interface parameterButton 
{
    button:  React.ReactNode,
}

function GroupBtn({button} : parameterButton) 
{
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
        {button}
      </Box>
    );
}

export default GroupBtn;