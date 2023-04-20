import React, { useCallback, useState, useEffect } from 'react';
import {
    Grid,
    useTheme,
    TableHead,
    TableRow,
    TableSortLabel,
    TableContainer,
    Table,
    TableBody,
    Typography,
    Divider,
    Stack,
    Pagination,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Tooltip,
} from '@mui/material';
import * as S from './ListAccessProfile.style'
import { useNavigate } from 'react-router-dom';
import LoadingBar from '../../../Organisms/LoadingBar';
import FormControl from '@mui/material/FormControl/FormControl';
import Select from '@mui/material/Select/Select';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ProfileAccessRowTemplate from '../../../Molecules/TableRowProfileAccess/ProfileAccessRow';
import { ListAccessProfile, DeleteAccessProfile } from '../../../../services/accessProfile';
import { verifyAccess } from '../../../../utils/verifyAccess';

function ListAccesProfileTemplate() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listAccess, setListAccess] = useState<any>([]);
    const [countAccess, setCountAccess] = useState<any>(-1);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [getPermissionUser, setPermissionUser] = useState<any>();
    // let getPermissionUser: any = {};

    async function handleOrder(entry: string) {

    }

    const handleDeletePermission = async (id: number) => {
        if (listAccess) {
            try {
                setLoading(true)
                await DeleteAccessProfile({ id: id });
                const data = await ListAccessProfile({
                    page: page,
                    perPage: rowsPerPage,
                    search: '',
                });
                setListAccess(data.data)
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
            const data = await ListAccessProfile({
                page: page,
                perPage: rowsPerPage,
                search: search,
            });
            setListAccess(data.data)
            setCountAccess(data.total)
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
            const data = await ListAccessProfile({
                page: newPage + 1,
                perPage: rowsPerPage,
                search: search,
            });
            setListAccess(data.data)
            setCountAccess(data.total)
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
            const data = await ListAccessProfile({
                page: 1,
                perPage: event,
                search: search,
            });
            setListAccess(data.data)
            setCountAccess(data.total)
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
                const data = await ListAccessProfile({
                    page: page,
                    perPage: rowsPerPage,
                    search: search,
                });
                setPermissionUser(temp);
                setListAccess(data.data)
                setCountAccess(data.total)
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
            <S.ListAccessProfileGrid>
                <Grid padding={'16px 24px'} display='flex' alignItems='center' justifyContent='space-between'>
                    <Grid display='flex' alignItems='flex-start' flexDirection={'column'}>
                        <S.ListAccessProfileTitle>
                            Perfil de Acesso
                        </S.ListAccessProfileTitle>
                        <S.ListAccessProfileDescription>
                            Lista de perfil de acessos
                        </S.ListAccessProfileDescription>
                    </Grid>
                    <Grid marginRight={'12px'}>
                        {getPermissionUser?.permission?.create && (
                            <Tooltip title="Adicionar permissão" color=''>
                                <IconButton
                                    onClick={() => navigate('/access-profile/new')}
                                    edge="end"
                                    size="large"
                                    color='primary'
                                >
                                    <LibraryAddIcon sx={{ width: '24px', height: '24px' }} />
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
                        <S.ListAccessProfileSearch sx={{ m: 1, width: '25ch' }} variant="outlined">
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
                        </S.ListAccessProfileSearch>
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
                                        <S.ListListAccessProfileDescriptionTableCell align={'left'}>
                                            <TableSortLabel onClick={(e) => handleOrder('id')}>
                                                #id
                                            </TableSortLabel>
                                        </S.ListListAccessProfileDescriptionTableCell>
                                        <S.ListListAccessProfileDescriptionTableCell align={'left'}>
                                            <TableSortLabel onClick={(e) => handleOrder('text')}>
                                                Nome
                                            </TableSortLabel>
                                        </S.ListListAccessProfileDescriptionTableCell>{/* {(getPermissionUser?.permission?.permissionEdit || getPermissionUser?.permission?.permissionDelete) && ( */}
                                        <S.ListListAccessProfileDescriptionTableCell align={'left'}>
                                            Descrição
                                        </S.ListListAccessProfileDescriptionTableCell>
                                        <S.ListListAccessProfileDescriptionTableCell align={'center'}>
                                            <TableSortLabel onClick={(e) => handleOrder('createdAt')}>
                                                Data
                                            </TableSortLabel>
                                        </S.ListListAccessProfileDescriptionTableCell>
                                        {(getPermissionUser?.permission?.update || getPermissionUser?.permission?.delete) && (
                                        <S.ListListAccessProfileDescriptionTableCell align={'center'}>
                                            Acões
                                        </S.ListListAccessProfileDescriptionTableCell>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {listAccess.map((row: any, i: number) => {
                                        return (
                                            <ProfileAccessRowTemplate
                                                key={`accessProfile-row-${row.id}`}
                                                index={i}
                                                id={row?.id}
                                                name={row?.name || ''}
                                                description={row?.description || ''}
                                                canEdit={getPermissionUser?.permission?.update}
                                                canDelete={getPermissionUser?.permission?.delete}
                                                createdAt={row.createdAt}
                                                onDelete={() => {
                                                    handleDeletePermission(row.id);
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
                        Mostrando {page} de {rowsPerPage > countAccess ? countAccess : rowsPerPage} de um total de {countAccess}
                    </Typography>
                    <Stack spacing={2}>
                        <Pagination
                            hidePrevButton={page == 1}
                            hideNextButton={page == Math.round(countAccess / rowsPerPage)}
                            count={Math.round(countAccess / rowsPerPage)}
                            shape="rounded"
                            onChange={(e, p) => {
                                handleChangePage(e, p)
                            }}
                        />
                    </Stack>
                </Grid>
            </S.ListAccessProfileGrid >
        </Grid>
    );
}

export default ListAccesProfileTemplate;