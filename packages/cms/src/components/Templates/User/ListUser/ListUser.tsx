import React, { useCallback, useState, useEffect } from 'react';
import {
    Grid,
    useTheme,
    TableHead,
    TableRow,
    TableCell,
    TableSortLabel,
    TableContainer,
    Table,
    TableBody,
    TablePagination,
    Typography,
    Button,
    Divider,
    Stack,
    Pagination,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Tooltip,
} from '@mui/material';
import * as S from './ListUser.style'
import { useNavigate } from 'react-router-dom';
import LoadingBar from '../../../Organisms/LoadingBar';
import UserRowTemplate from '../../../Molecules/TableRowUser/UserRow';
import { DeleteUser, ListUser } from '../../../../services/user';
import FormControl from '@mui/material/FormControl/FormControl';
import Select from '@mui/material/Select/Select';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { getUser } from '../../../../utils/token';
import { verifyAccess } from '../../../../utils/verifyAccess';

function ListUserTemplate() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listUser, setListUser] = useState<any>([]);
    const [countUser, setCountUser] = useState<any>(-1);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [getPermissionUser, setPermissionUser] = useState<any>();
    // let getPermissionUser: any = {};

    async function handleOrder(entry: string) {

    }

    const handleDeleteUser = async (id: number) => {
        if (listUser) {
            try {
                setLoading(true)
                await DeleteUser({ id: id });
                const data = await ListUser({
                    page: page,
                    perPage: rowsPerPage,
                    search: '',
                });
                setListUser(data.data)
                setCountUser(data.total)
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false)
            }
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true)
            const data = await ListUser({
                page: page,
                perPage: rowsPerPage,
                search: search,
            });
            setListUser(data.data)
            setCountUser(data.total)
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false)
        }
    };

    const handleChangePage = async (event: unknown, newPage: number) => {
        setPage(newPage);
        try {
            setLoading(true)
            const data = await ListUser({
                page: newPage + 1,
                perPage: rowsPerPage,
                search: search,
            });
            setListUser(data.data)
            setCountUser(data.total)
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false)
        }
    };

    const handleChangeRowsPerPage = async (event: any) => {
        setRowsPerPage(event);
        setPage(1);
        try {
            setLoading(true)
            const data = await ListUser({
                page: 1,
                perPage: event,
                search: search,
            });
            setListUser(data.data)
            setCountUser(data.total)
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const temp = await verifyAccess();
                const data = await ListUser({
                    page: page,
                    perPage: rowsPerPage,
                    search: search,
                });
                setPermissionUser(temp);
                setListUser(data.data)
                setCountUser(data.total)
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [])

    return (
        <Grid sx={{ padding: '0px 12px', overflow: 'auto' }}>
            <S.ListUserGrid>
                <Grid padding={'16px 24px'} display='flex' alignItems='center' justifyContent='space-between'>
                    <Grid display='flex' alignItems='flex-start' flexDirection={'column'}>
                        <S.ListUserTitle>
                            Usuários
                        </S.ListUserTitle>
                        <S.ListUserDescription>
                            Lista de usuários
                        </S.ListUserDescription>
                    </Grid>
                    <Grid marginRight={'12px'}>
                        {getPermissionUser?.user?.create && (
                            <Tooltip title="Adicionar usuário" color=''>
                                <IconButton
                                    onClick={() => navigate('/users/new')}
                                    edge="end"
                                    size="large"
                                    color='primary'
                                >
                                    <PersonAddIcon sx={{ width: '24px', height: '24px' }} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Grid>
                </Grid>
                <Divider />
                <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'16px 24px'}>
                    <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={'10px'}>
                        <FormControl>
                            <Select
                                sx={{ height: '33px' }}
                                labelId="rowsPerPage"
                                id="rowsPerPageId"
                                value={rowsPerPage}
                                onChange={(e) => {
                                    handleChangeRowsPerPage(e.target.value)
                                }}
                            >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={30}>30</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography>Entradas por página</Typography>
                    </Grid>
                    <Grid>
                        <S.ListUserSearch sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <InputLabel htmlFor="search">Buscar</InputLabel>
                            <OutlinedInput
                                id="search"
                                type={'text'}
                                value={search}
                                onChange={(e) => {
                                    const temp = e.target.value;
                                    setSearch(temp);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleSearch}
                                            edge="end"
                                            size="small"
                                        >
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Buscar"
                            />
                        </S.ListUserSearch>
                    </Grid>
                </Grid>
                <Grid container alignItems='center' justifyContent='flex-end' padding={'16px 24px'} width={'900px'}>
                    <TableContainer>
                        {loading ? (
                            <LoadingBar />
                        ) : (
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow style={{ height: 33 }}>
                                        <S.ListUserTableCell align={'left'}>
                                            <TableSortLabel onClick={(e) => handleOrder('id')}>
                                                #id
                                            </TableSortLabel>
                                        </S.ListUserTableCell>
                                        <S.ListUserTableCell align={'left'}>
                                            <TableSortLabel onClick={(e) => handleOrder('text')}>
                                                Nome
                                            </TableSortLabel>
                                        </S.ListUserTableCell>
                                        <S.ListUserTableCell align={'left'}>
                                            <TableSortLabel onClick={(e) => handleOrder('text')}>
                                                E-mail
                                            </TableSortLabel>
                                        </S.ListUserTableCell>
                                        <S.ListUserTableCell align={'center'}>
                                            <TableSortLabel onClick={(e) => handleOrder('createdAt')}>
                                                Data
                                            </TableSortLabel>
                                        </S.ListUserTableCell>
                                        {(getPermissionUser?.user?.update || getPermissionUser?.user?.delete) && (
                                            <S.ListUserTableCell align={'center'}>
                                                Ações
                                            </S.ListUserTableCell>
                                        )}
                                        {(getPermissionUser?.user?.update || getPermissionUser?.user?.delete) && (
                                            <S.ListUserTableCell align={'center'}>
                                                Status
                                            </S.ListUserTableCell>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {listUser.map((row: any, i: number) => {
                                        return (
                                            <UserRowTemplate
                                                key={`user-row-${row.id}`}
                                                index={i}
                                                id={row?.id}
                                                canEdit={getPermissionUser?.user?.update}
                                                canDelete={getPermissionUser?.user?.delete}
                                                canChangeStatus={getPermissionUser?.user?.update}
                                                firstName={row?.profile?.firstName || ''}
                                                lastName={row?.profile?.lastName || ''}
                                                email={row?.email || ''}
                                                status={row?.isActive || false}
                                                createdAt={row.createdAt}
                                                onDelete={() => {
                                                    handleDeleteUser(row.id);
                                                }}
                                            />
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                </Grid>
                <Divider sx={{ margin: '0px 24px' }} />
                <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'16px 24px 32px 24px'}>
                    <Typography>
                        Mostrando {page} de {rowsPerPage > countUser ? countUser : rowsPerPage} de um total de {countUser}
                    </Typography>
                    <Stack spacing={2}>
                        <Pagination
                            hidePrevButton={page == 1}
                            hideNextButton={page == Math.round(countUser / rowsPerPage)}
                            count={Math.round(countUser / rowsPerPage)}
                            shape="rounded"
                            onChange={(e, p) => {
                                handleChangePage(e, p)
                            }}
                        />
                    </Stack>
                </Grid>
            </S.ListUserGrid >
        </Grid>
    );
}

export default ListUserTemplate;