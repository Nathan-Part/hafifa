import { Container, Typography } from '@mui/material';

function Home() {
  const containerStyle: React.CSSProperties = {
    marginTop: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const titleStyle: React.CSSProperties = {
    marginBottom: '16px',
  };

  const subtitleStyle: React.CSSProperties = {
    marginBottom: '32px',
  };

  return (
    <Container maxWidth="md" style={containerStyle}>
      <Typography variant="h2" sx={titleStyle}>
        Mesima 28
      </Typography>
      <Typography variant="h4" style={subtitleStyle}>
        Découvrez une expérience web incroyable avec MUI
      </Typography>
    </Container>
  );
}

export default Home;
