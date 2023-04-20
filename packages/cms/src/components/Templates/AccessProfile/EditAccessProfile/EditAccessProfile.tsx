import {
    Typography,
    Divider,
    Accordion,
    Checkbox,
    AccordionDetails,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as S from './EditAccessProfile.style'
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import MyGrid from '../../../Molecules/MyGrid';
import { GetAccessProfile, UpdateAccessProfile } from '../../../../services/accessProfile';
import { ListAllPermissions } from '../../../../services/permission';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingBar from '../../../Organisms/LoadingBar/LoadingBar';

let initialValues = {
    id: 0,
    name: '',
    description: '',
    userCreate: false,
    userRead: false,
    userUpdate: false,
    userDelete: false,
    permissionCreate: false,
    permissionRead: false,
    permissionUpdate: false,
    permissionDelete: false,
};

function EditAccessProfileTemplate() {
    const { id } = useParams();
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const submitRequest = useCallback(
        (values: typeof initialValues) => {
            const editAccessProfile = async () => {
                try {
                    setLoading(true);

                    const temp = await ListAllPermissions();

                    let dataBody: any = {
                        id: id,
                        name: values.name,
                        description: values.description,
                        permissionsProfile: [],
                    };

                    if (!!values.userRead) {
                        const tempId = temp.find((a: any) => a.name == 'USER')?.id
                        const user = {
                            permissionId: tempId,
                            create: values.userCreate,
                            read: values.userRead,
                            update: values.userUpdate,
                            delete: values.userDelete,
                        }
                        dataBody.permissionsProfile.push(user)
                    }
                    if (!!values.permissionRead) {
                        const tempId = temp.find((a: any) => a.name == 'PERMISSION')?.id
                        const permission = {
                            permissionId: tempId,
                            create: values.permissionCreate,
                            read: values.permissionRead,
                            update: values.permissionUpdate,
                            delete: values.permissionDelete,
                        }
                        dataBody.permissionsProfile.push(permission)
                    }

                    await UpdateAccessProfile(dataBody);
                    navigate('/access-profile')
                } catch (e) {
                    console.log(e);
                } finally {
                    setLoading(false);
                }
            };

            editAccessProfile();
        },
        // [loading],
        [],
    );

    const formik = useFormik({
        initialValues,
        onSubmit: submitRequest,
        validationSchema: Yup.object().shape({
            name: Yup.string().required('* Campo obrigatório')
                .min(3, '* Nome deve conter pelo menos 4 caracteres')
                .max(80, '* Nome deve conter no máximo 80 caracteres'),
            description: Yup.string().required('* Campo obrigatório')
                .min(3, '* Descrição deve conter pelo menos 4 caracteres')
                .max(244, '* Descrição deve conter no máximo 244 caracteres')

        }),
    });

    useEffect(() => {
        async function fetchPermission() {
            formik.resetForm();
            if (!!id) {
                try {
                    setLoading(true);
                    const tempAccess = await GetAccessProfile(parseInt(id));

                    formik.values.id = tempAccess?.id || '';
                    formik.values.name = tempAccess?.name || '';
                    formik.values.description = tempAccess?.description || "";

                    const permissionProfile = tempAccess?.permissionProfile;
                    const userP = permissionProfile.find((a: any) => a.permission.name == 'USER')
                    const permissionP = permissionProfile.find((a: any) => a.permission.name == 'PERMISSION')

                    formik.values.userCreate = userP?.create || false;
                    formik.values.userRead = userP?.read || false;
                    formik.values.userUpdate = userP?.update || false;
                    formik.values.userDelete = userP?.delete || false;
                    formik.values.permissionCreate = permissionP?.create || false;
                    formik.values.permissionRead = permissionP?.read || false;
                    formik.values.permissionUpdate = permissionP?.update || false;
                    formik.values.permissionDelete = permissionP?.delete || false;
                } catch (e) {
                    console.log(e);
                    navigate('/access-profile')
                } finally {
                    setLoading(false);
                }
            } else {
                navigate('/access-profile');
            }
        }
        fetchPermission();
    }, [])

    return (
        <Grid sx={{ padding: '0px 12px' }}>
            <S.EditAccessProfileGrid display={'flex'} flexDirection={'column'}>
                <Grid>
                    <Typography variant='h1' fontSize={24} letterSpacing={'0.017em'}>
                        Editar um perfil de acesso
                    </Typography>
                </Grid>
                {loading ? (
                    <Grid container spacing={3} alignItems='flex-start' sx={{
                        width: '100%',
                        margin: 0,
                        marginTop: '40px'
                    }}>
                        <LoadingBar />
                    </Grid>
                ) : (
                    <>
                        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
                            <Grid container spacing={3} alignItems='flex-start' sx={{
                                width: '100%',
                                margin: 0,
                            }}>
                                <MyGrid item xs={12}>
                                    <S.EditAccessProfileTextField
                                        fullWidth
                                        label="Nome"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        error={Boolean(formik.touched.name && formik.errors.name)}
                                        helperText={formik.touched.name && formik.errors.name}
                                        inputProps={{ maxLength: 50 }}
                                    />
                                </MyGrid>
                                <MyGrid item xs={12}>
                                    <S.EditAccessProfileTextField
                                        multiline
                                        fullWidth
                                        label="Descrição"
                                        name="description"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        error={Boolean(formik.touched.description && formik.errors.description)}
                                        helperText={formik.touched.description && formik.errors.description}
                                        inputProps={{ maxLength: 244 }}
                                    />
                                </MyGrid>
                            </Grid>
                            <Grid container spacing={3} alignItems='flex-start' sx={{
                                width: '100%',
                                margin: 0,
                            }}>
                                <MyGrid onLeft={true} item md={6} sm={6} xs={12}>
                                    <MyGrid textAlign={'start'} display={'flex'} alignItems={'center'}>
                                        <Accordion sx={{ boxShadow: 'none' }}>
                                            <S.EditAccessProfileAccordionSummary
                                                sx={{
                                                    padding: 0,
                                                    minHeight: '24px !important',
                                                }}
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="permission-acc"
                                                id="permission-acc"
                                            >
                                                <Typography marginRight={'10px'}>
                                                    Usuário
                                                </Typography>
                                            </S.EditAccessProfileAccordionSummary>
                                            <AccordionDetails>
                                                <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '0px', marginTop: '0px' }}>
                                                    <MyGrid item xs={12} textAlign={'start'}>
                                                        <S.EditAccessProfileFormControlLabel control={
                                                            <Checkbox
                                                                value={formik.values.userRead}
                                                                checked={formik.values.userRead}
                                                                onChange={(e) => {
                                                                    const temp = e.target.checked;
                                                                    formik.setFieldValue('userRead', temp);
                                                                    if (!temp) {
                                                                        formik.setFieldValue('userCreate', temp);
                                                                        formik.setFieldValue('userUpdate', temp);
                                                                        formik.setFieldValue('userDelete', temp);
                                                                    }
                                                                }}
                                                            />
                                                        }
                                                            style={{ fontSize: 14 }}
                                                            label="Listar"
                                                        />
                                                    </MyGrid>
                                                    <MyGrid item xs={12} textAlign={'start'}>
                                                        <S.EditAccessProfileFormControlLabel control={
                                                            <Checkbox
                                                                value={formik.values.userCreate}
                                                                checked={formik.values.userCreate}
                                                                onChange={(e) => {
                                                                    const temp = e.target.checked;
                                                                    formik.setFieldValue('userCreate', temp);
                                                                    if (!!temp)
                                                                        formik.setFieldValue('userRead', temp);
                                                                }}
                                                            />
                                                        }
                                                            style={{ fontSize: 14 }}
                                                            label="Criar"
                                                        />
                                                    </MyGrid>
                                                    <MyGrid item xs={12} textAlign={'start'}>
                                                        <S.EditAccessProfileFormControlLabel control={
                                                            <Checkbox
                                                                value={formik.values.userUpdate}
                                                                checked={formik.values.userUpdate}
                                                                onChange={(e) => {
                                                                    const temp = e.target.checked;
                                                                    formik.setFieldValue('userUpdate', temp);
                                                                    if (!!temp)
                                                                        formik.setFieldValue('userRead', temp);
                                                                }}
                                                            />
                                                        }
                                                            style={{ fontSize: 14 }}
                                                            label="Editar"
                                                        />
                                                    </MyGrid>
                                                    <MyGrid item xs={12} textAlign={'start'}>
                                                        <S.EditAccessProfileFormControlLabel control={
                                                            <Checkbox
                                                                value={formik.values.userDelete}
                                                                checked={formik.values.userDelete}
                                                                onChange={(e) => {
                                                                    const temp = e.target.checked;
                                                                    formik.setFieldValue('userDelete', temp);
                                                                    if (!!temp)
                                                                        formik.setFieldValue('userRead', temp);
                                                                }}
                                                            />
                                                        }
                                                            style={{ fontSize: 14 }}
                                                            label="Deletar"
                                                        />
                                                    </MyGrid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </MyGrid>
                                </MyGrid>
                                <MyGrid item md={6} sm={6} xs={12}>
                                    <MyGrid item xs={12} textAlign={'start'} display={'flex'} alignItems={'center'}>
                                        <Accordion sx={{ boxShadow: 'none' }}>
                                            <S.EditAccessProfileAccordionSummary
                                                sx={{
                                                    padding: 0,
                                                    minHeight: '24px !important',
                                                }}
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="permission-acc"
                                                id="permission-acc"
                                            >
                                                <Typography marginRight={'10px'}>
                                                    Permissão
                                                </Typography>
                                            </S.EditAccessProfileAccordionSummary>
                                            <AccordionDetails>
                                                <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '0px', marginTop: '0px' }}>
                                                    <MyGrid item xs={12} textAlign={'start'}>
                                                        <S.EditAccessProfileFormControlLabel control={
                                                            <Checkbox
                                                                value={formik.values.permissionRead}
                                                                checked={formik.values.permissionRead}
                                                                onChange={(e) => {
                                                                    const temp = e.target.checked;
                                                                    formik.setFieldValue('permissionRead', temp);
                                                                    if (!temp) {
                                                                        formik.setFieldValue('permissionCreate', temp);
                                                                        formik.setFieldValue('permissionUpdate', temp);
                                                                        formik.setFieldValue('permissionDelete', temp);
                                                                    }
                                                                }}
                                                            />
                                                        }
                                                            style={{ fontSize: 14 }}
                                                            label="Listar"
                                                        />
                                                    </MyGrid>
                                                    <MyGrid item xs={12} textAlign={'start'}>
                                                        <S.EditAccessProfileFormControlLabel control={
                                                            <Checkbox
                                                                value={formik.values.permissionCreate}
                                                                checked={formik.values.permissionCreate}
                                                                onChange={(e) => {
                                                                    const temp = e.target.checked;
                                                                    formik.setFieldValue('permissionCreate', temp);
                                                                    if (!!temp)
                                                                        formik.setFieldValue('permissionRead', temp);
                                                                }}
                                                            />
                                                        }
                                                            style={{ fontSize: 14 }}
                                                            label="Criar"
                                                        />
                                                    </MyGrid>
                                                    <MyGrid item xs={12} textAlign={'start'}>
                                                        <S.EditAccessProfileFormControlLabel control={
                                                            <Checkbox
                                                                value={formik.values.permissionUpdate}
                                                                checked={formik.values.permissionUpdate}
                                                                onChange={(e) => {
                                                                    const temp = e.target.checked;
                                                                    formik.setFieldValue('permissionUpdate', temp);
                                                                    if (!!temp)
                                                                        formik.setFieldValue('permissionRead', temp);
                                                                }}
                                                            />
                                                        }
                                                            style={{ fontSize: 14 }}
                                                            label="Editar"
                                                        />
                                                    </MyGrid>
                                                    <MyGrid item xs={12} textAlign={'start'}>
                                                        <S.EditAccessProfileFormControlLabel control={
                                                            <Checkbox
                                                                value={formik.values.permissionDelete}
                                                                checked={formik.values.permissionDelete}
                                                                onChange={(e) => {
                                                                    const temp = e.target.checked;
                                                                    formik.setFieldValue('permissionDelete', temp);
                                                                    if (!!temp)
                                                                        formik.setFieldValue('permissionRead', temp);
                                                                }}
                                                            />
                                                        }
                                                            style={{ fontSize: 14 }}
                                                            label="Deletar"
                                                        />
                                                    </MyGrid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </MyGrid>
                                </MyGrid>
                            </Grid>
                            <Grid container spacing={1} alignItems='flex-start' sx={{
                                width: '100%',
                                margin: 0,
                                marginTop: '15px'
                            }}>
                                <S.EditAccessProfileGridBts xs={12} item>
                                    <LoadingButton loading={loading} variant='text' onClick={() => navigate('/access-profile')}>
                                        Cancelar
                                    </LoadingButton>
                                    <LoadingButton loading={loading} type='submit' variant='contained'>
                                        Editar perfil de acesso
                                    </LoadingButton>
                                </S.EditAccessProfileGridBts>
                            </Grid>
                        </form>
                    </>
                )}

            </S.EditAccessProfileGrid>
        </Grid >
    );
}

export default EditAccessProfileTemplate;