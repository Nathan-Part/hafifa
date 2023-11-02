import { Box } from "@mui/material";

interface parameterButton {
  children: React.ReactNode;
}

function GroupBtn({ children }: parameterButton) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "10px",
      }}
    >
      {children}
    </Box>
  );
}

export default GroupBtn;
