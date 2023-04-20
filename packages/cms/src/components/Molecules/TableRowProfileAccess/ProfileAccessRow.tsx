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
} from '@mui/material';
import { DeleteOutlineOutlined, CreateOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import * as S from './ProfileAccessRow.style';
import { getUser } from '../../../utils/token';

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

interface PermissionRow {
  index: number,
  id: number,
  name: string,
  description: any,
  canEdit: boolean,
  canDelete: boolean,
  createdAt: Date;
  onDelete: (event: void) => void;
}

function ProfileAccessRowTemplate({
  index,
  id,
  name,
  description,
  canEdit,
  canDelete,
  createdAt,
  onDelete
}: PermissionRow) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  // let getPermissionUser: any = {};

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
        {description}
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
                  navigate(`/access-profile/edit/${id}`)
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
          <S.ProfileAccessGridModal>
            <Grid>
              <Typography variant={'h4'} style={{ fontWeight: 'bold' }}>
                Excluir Perfil de Acesso?
              </Typography>
              <Typography style={{ marginBottom: 30 }}>
                Deseja mesmo excluir este perfil? Esta ação é Irreversível!
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
          </S.ProfileAccessGridModal>
        }
      </Modal>
    </TableRow>
  );
}

export default ProfileAccessRowTemplate;
