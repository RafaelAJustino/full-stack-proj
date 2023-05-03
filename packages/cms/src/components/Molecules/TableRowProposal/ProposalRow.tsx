import React, { useEffect, useState } from 'react';
import {
  Grid,
  IconButton,
  TableCell,
  TableRow,
  Modal,
  Typography,
  Button,
  useTheme,
  Switch,
} from '@mui/material';
import { DeleteOutlineOutlined, CreateOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import * as S from './ProposalRow.style';
import { getUser } from '../../../utils/token';
import { UpdateUserStatus } from '../../../services/user';

function getModalStyle() {
  const top = 0;
  const left = 0;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    backgroundColor: 'white',
  };
}

interface UserRow {
  index: number,
  id: number,
  name: string,
  type: string,
  client: any,
  contact: string,
  canEdit: boolean,
  canDelete: boolean,
  createdAt: Date;
  onDelete: (event: void) => void;
  onEdit: (event: any) => any;
}

function ProposalRowTemplate({
  index,
  id,
  client,
  name,
  type,
  contact,
  canEdit,
  canDelete,
  createdAt,
  onDelete,
  onEdit
}: UserRow) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <TableRow hover key={index} sx={{ borderBottom: 'none' }} >
      <TableCell align={'left'} style={{ padding: 5, border: 'none' }}>
        {id}
      </TableCell>
      <TableCell align={'left'} style={{ padding: 5, border: 'none' }}>
        {name}
      </TableCell>
      <TableCell align={'left'} style={{ padding: 5, border: 'none' }}>
        {type}
      </TableCell>
      <TableCell align={'left'} style={{ padding: 5, border: 'none' }}>
        {contact}
      </TableCell>
      <TableCell align={'center'} style={{ padding: 5, border: 'none' }}>
        {JSON.stringify(createdAt)}
      </TableCell>
      <TableCell align={'center'} style={{ padding: 5, border: 'none' }}>
        <Grid style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {
            canEdit && (
              <IconButton
                onClick={async () => {
                  onEdit({
                    name,
                    client
                  });
                }}>
                <CreateOutlined />
              </IconButton>
            )
          }

          {
            canDelete && (
              <IconButton
                onClick={async () => {
                  handleOpen();
                }}>
                <DeleteOutlineOutlined />
              </IconButton>
            )
          }
        </Grid>
      </TableCell>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        {
          <S.ProposalRowGridModal>
            <Grid>
              <Typography variant={'h4'} style={{ fontWeight: 'bold' }}>
                Excluir Proposta?
              </Typography>
              <Typography style={{ marginBottom: 30 }}>
                Deseja mesmo excluir esta proposta? Esta ação é Irreversível!
              </Typography>
            </Grid>
            <Grid display={'flex'} justifyContent={'space-between'} width={'100%'}>
              <Grid>
                <Button
                  variant='contained'
                  onClick={async () => {
                    // await deleteComment(id);
                    onDelete();
                    handleClose();
                  }}>
                  Confirmar
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="text"
                  onClick={async () => {
                    handleClose();
                  }}>
                  Recusar
                </Button>
              </Grid>
            </Grid>
          </S.ProposalRowGridModal>
        }
      </Modal>
    </TableRow>
  );
}

export default ProposalRowTemplate;
