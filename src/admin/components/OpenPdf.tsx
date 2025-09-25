import React from 'react';
import { Box, Button, Header, Text } from '@adminjs/design-system';
import { RecordJSON } from 'adminjs';

type Props = {
  record: RecordJSON;
};

const OpenPdf: React.FC<Props> = ({ record }) => {
  const handleOpen = () => {
    const fileName = `pedido-${record.params.id}.pdf`;
    const fileUrl = `/exports/${fileName}`;
    window.open(fileUrl, '_blank');
  };

  return (
    <Box variant="grey">
      <Header>PDF gerado com sucesso!</Header>
      <Text>Você pode abrir o PDF em uma nova aba clicando abaixo:</Text>
      <Button mt="lg" onClick={handleOpen}>
        Abrir PDF
      </Button>
    </Box>
  );
};

export default OpenPdf;