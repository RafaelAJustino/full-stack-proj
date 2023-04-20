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
import * as S from './UserRow.style';
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
  firstName: string,
  lastName: string,
  email: string,
  status: boolean,
  canEdit: boolean,
  canDelete: boolean,
  canChangeStatus: boolean,
  createdAt: Date;
  onDelete: (event: void) => void;
}

function UserRowTemplate({
  index,
  id,
  firstName,
  lastName,
  email,
  status,
  canEdit,
  canDelete,
  canChangeStatus,
  createdAt,
  onDelete
}: UserRow) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(status);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateStatus = async (value: boolean) => {
    setChecked(value);
    await UpdateUserStatus({id, isActive: value});
  }

  return (
    <TableRow hover key={index} sx={{ borderBottom: 'none' }} >
      <TableCell align={'left'} style={{ padding: 5, border: 'none' }}>
        {id}
      </TableCell>
      <TableCell align={'left'} style={{ padding: 5, border: 'none' }}>
        {`${firstName} ${lastName}`}
      </TableCell>
      <TableCell align={'left'} style={{ padding: 5, border: 'none' }}>
        {email}
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
                  navigate(`/users/edit/${id}`)
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
      <TableCell align={'center'} style={{ padding: 5, border: 'none' }}>
        {
          canChangeStatus && (
            <Switch
            defaultChecked={status}
            value={checked}
              onChange={(e) => {
                handleUpdateStatus(e.target.checked);
              }}
            />
          )
        }
      </TableCell>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        {
          <S.UserRowGridModal>
            <Grid>
              <Typography variant={'h4'} style={{ fontWeight: 'bold' }}>
                Excluir Usuário?
              </Typography>
              <Typography style={{ marginBottom: 30 }}>
                Deseja mesmo excluir este usuário? Esta ação é Irreversível!
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
          </S.UserRowGridModal>
        }
      </Modal>
    </TableRow>
  );
}

export default UserRowTemplate;
