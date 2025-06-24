import React from 'react';
import { Container, Box } from '@mui/material';
import CustomAppBar from '../components/Layout/AppBar';
import ClientsList from '../components/Clients/ClientsList';

const ClientsPage = () => {
  return (
    <Box>
      <CustomAppBar />
      <Container maxWidth={false} sx={{ mt: 8, mb: 4, px: 0 }}>
        <ClientsList />
      </Container>
    </Box>
  );
};

export default ClientsPage;