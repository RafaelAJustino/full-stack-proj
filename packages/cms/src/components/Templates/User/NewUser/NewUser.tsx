import {
    Visibility,
    VisibilityOff,
    Upload
} from '@mui/icons-material';
import {
    Avatar,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography,
    Select,
    Divider,
    Button,
    MenuItem,
    Tooltip,
} from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText/FormHelperText';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './NewUser.style'
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { CreateUser } from '../../../../services/user';
import { phoneMask } from '../../../../utils/phoneMask';
import MyGrid from '../../../Molecules/MyGrid';
import { ListAllAccessProfile } from '../../../../services/accessProfile';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const initialValues = {
    email: '',
    password: '',
    verifyPassword: '',
    phone: '',
    firstName: '',
    lastName: '',
    cpf: '',
    state: '',
    city: '',
    zipCode: '',
    about: '',
    address: '',
    _bairro: '',
    _rua: '',
    _numero: '',
    _complemento: '',
    accessProfileId: [],
};

function NewUserTemplate() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listAcessProfile, setListAcessProfile] = useState<any>([]);

    const submitRequest = useCallback(
        (values: typeof initialValues) => {

            const temp = {
                email: values.email,
                password: values.password,
                phone: values.phone,
                firstName: values.firstName,
                lastName: values.lastName,
                cpf: values.cpf,
                state: values.state.toUpperCase(),
                city: values.city,
                zipCode: values.zipCode,
                about: values.about,
                address: `${values._rua}| ${values._numero}| ${values._bairro}${!!values._complemento ? '| ' + values._complemento : ''}`,
                accessProfileId: values?.accessProfileId.map((a) => {
                    return {
                        accessProfileId: parseInt(a),
                    }
                }),
            }

            const createUser = async () => {
                try {
                    setLoading(true);
                    await CreateUser(temp);
                    navigate('/users');
                } catch (e) {
                    console.log(e);
                } finally {
                    setLoading(false);
                }
            };

            createUser();
        },
        // [loading],
        [],
    );

    const formik = useFormik({
        initialValues,
        onSubmit: submitRequest,
        validationSchema: Yup.object().shape({
            email: Yup.string().required('* Campo obrigatório')
                .email('* Necessita um e-mail válido')
                .min(4, '* Email deve conter pelo menos 4 caracteres')
                .max(80, '* Email deve conter no máximo 80 caracteres'),
            phone: Yup.string().required('* Campo obrigatório')
                .min(14, '* Telefone deve conter pelo menos 14 caracteres')
                .max(15, '* Telefone deve conter no máximo 15 caracteres'),
            password: Yup.string().required('* Campo obrigatório')
                .min(8, '* Senha deve conter pelo menos 8 caracteres')
                .max(80, '* Senha deve conter no máximo 80 caracteres'),
            verifyPassword: Yup.string().required('* Campo obrigatório')
                .oneOf([Yup.ref('password'), null], '* Senhas devem ser iguais'),
            firstName: Yup.string().required('* Campo obrigatório')
                .min(2, '* Nome deve conter pelo menos 2 caracteres')
                .max(50, '* Nome deve conter no máximo 50 caracteres'),
            lastName: Yup.string().required('* Campo obrigatório')
                .min(2, '* Sobrenome deve conter pelo menos 2 caracteres')
                .max(50, '* Sobrenome deve conter no máximo 50 caracteres'),
            cpf: Yup.string().required('* Campo obrigatório')
                .length(11, '* CPF deve conter 11 caracteres'),
            state: Yup.string().required('* Campo obrigatório'),
            city: Yup.string().required('* Campo obrigatório')
                .min(2, '* Cidade deve conter pelo menos 2 caracteres')
                .max(100, '* Cidade deve conter no máximo 100 caracteres'),
            zipCode: Yup.string().required('* Campo obrigatório')
                .length(8, '* Cidade deve conter 8 caracteres'),
            _bairro: Yup.string().required('* Campo obrigatório')
                .min(2, '* Cidade deve conter pelo menos 2 caracteres')
                .max(100, '* Cidade deve conter no máximo 100 caracteres'),
            _rua: Yup.string().required('* Campo obrigatório')
                .min(2, '* Cidade deve conter pelo menos 2 caracteres')
                .max(100, '* Cidade deve conter no máximo 100 caracteres'),
            _numero: Yup.string().required('* Campo obrigatório')
                .min(1, '* Cidade deve conter pelo menos 1 caracteres'),
        }),
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClickShowVerifyPassword = () => setShowVerifyPassword((show) => !show);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const tempListAcessProfile = await ListAllAccessProfile();
                setListAcessProfile(tempListAcessProfile);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [])

    return (
        <Grid sx={{ padding: '0px 12px' }}>
            <form onSubmit={formik.handleSubmit}
                style={{
                    maxWidth: '1030px',
                    display: 'flex',
                    flexDirection: 'row',
                    margin: '0 auto',
                }}>
                <Grid container>
                    <S.NewUserGrid
                        item
                        md={3.5}
                        sm={12}
                        xs={12}
                        flexDirection={'column'}
                        alignItems={'center'}
                        height={'fit-content'}
                        style={{ marginBottom: 0 }}
                    >
                        <Grid marginBottom={'24px'} textAlign={'start'}>
                            <Typography variant='h1' fontSize={24} letterSpacing={'0.017em'}>
                                Imagem de perfil
                            </Typography>
                            <Typography fontSize={14} letterSpacing={'0.017em'} style={{ opacity: '0.6' }}>
                                JPG ou PNG
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            width={'100%'}
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'center'}
                            gap={'10px'}
                        >
                            <Avatar src="" sx={{ width: '150px', height: '150px' }} variant='circular' />
                            <Typography fontSize={12} letterSpacing={'0.017em'} style={{ opacity: '0.6' }}>
                                JPG ou PNG
                            </Typography>
                            <Button variant="contained" endIcon={<Upload />} sx={{ marginTop: '10px' }}>
                                Adicionar imagem
                            </Button>
                        </Grid>
                    </S.NewUserGrid>
                    <S.NewUserGrid item md={7.5} sm={12} xs={12} display={'flex'} flexDirection={'column'}>
                        <Grid textAlign={'start'}>
                            <Typography variant='h1' fontSize={24} letterSpacing={'0.017em'}>
                                Criação de usuário
                            </Typography>
                            <Typography fontSize={14} letterSpacing={'0.017em'} style={{ opacity: '0.6' }}>
                                Criar um novo usuário
                            </Typography>
                        </Grid>
                        <Grid container spacing={3} alignItems='flex-start' sx={{
                            width: '100%',
                            margin: 0,
                        }}>
                            <MyGrid onLeft={true} item md={6} sm={6} xs={12}>
                                <S.NewUserTextField
                                    fullWidth
                                    label="Primeiro Nome"
                                    name="firstName"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                    inputProps={{ maxLength: 50 }}
                                />
                            </MyGrid>
                            <MyGrid onRight={true} item md={6} sm={6} xs={12}>
                                <S.NewUserTextField
                                    fullWidth
                                    label="Último Nome"
                                    name="lastName"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                    inputProps={{ maxLength: 50 }}
                                />
                            </MyGrid>
                            <MyGrid onLeft={true} item md={6} sm={6} xs={12}>
                                <S.NewUserTextField
                                    fullWidth
                                    label="CPF"
                                    name="cpf"
                                    value={formik.values.cpf}
                                    onChange={(e) => {
                                        formik.setFieldValue('cpf', e.target.value.replace(/\D/gi, ''))
                                    }}
                                    error={Boolean(formik.touched.cpf && formik.errors.cpf)}
                                    helperText={formik.touched.cpf && formik.errors.cpf}
                                    inputProps={{ maxLength: 11 }}
                                />
                            </MyGrid>
                            <MyGrid onRight={true} item md={6} sm={6} xs={12}>
                                <S.NewUserTextField
                                    fullWidth
                                    label="Telefone"
                                    name="phone"
                                    value={formik.values.phone}
                                    onChange={(e) => {
                                        const val = phoneMask(e.target.value);
                                        formik.setFieldValue('phone', val)
                                    }}
                                    error={Boolean(formik.touched.phone && formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                    inputProps={{ maxLength: 15 }}
                                />
                            </MyGrid>
                            <MyGrid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="accessProfileIdlabel">Perfis de acesso</InputLabel>
                                    <Select
                                        labelId="accessProfileIdlabel"
                                        id="accessProfileId"
                                        name="accessProfileId"
                                        multiple
                                        value={formik.values.accessProfileId}
                                        defaultValue={formik.values.accessProfileId}
                                        onChange={(e) => {
                                            const temp = e.target.value;
                                            formik.setFieldValue('accessProfileId', temp);
                                        }}
                                        input={<OutlinedInput label="Perfis de acesso" />}
                                        style={{ textAlign: 'start' }}
                                        error={Boolean(formik.touched.accessProfileId && formik.errors.accessProfileId)}
                                    >
                                        {listAcessProfile.map((item: any, i: number) => {
                                            return (
                                                <MenuItem
                                                    key={item?.id + i}
                                                    value={item?.id}
                                                    sx={{ textTransform: 'capitalize' }}
                                                >
                                                    <Grid sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px'
                                                    }}>
                                                        {item?.name}
                                                        <Tooltip
                                                            title={item?.description || ''}
                                                            placement={'right'}
                                                        >
                                                            <InfoOutlinedIcon />
                                                        </Tooltip>
                                                    </Grid>
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                    {Boolean(formik.touched.accessProfileId && formik.errors.accessProfileId) && (
                                        <FormHelperText error style={{ marginLeft: 0, }}>
                                            {formik.touched.accessProfileId && formik.errors.accessProfileId}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </MyGrid>
                        </Grid>
                        <Divider style={{ marginTop: 24, width: '100%' }} />
                        <Grid container spacing={3} alignItems='flex-start' sx={{
                            width: '100%',
                            margin: 0,
                        }}>
                            <MyGrid onLeft={true} item md={6} sm={6} xs={12}>
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                >
                                    <InputLabel htmlFor="password">Senha</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Senha"
                                        error={Boolean(formik.touched.password && formik.errors.password)}
                                        inputProps={{ maxLength: 80 }}
                                    />
                                    {Boolean(formik.touched.password && formik.errors.password) && (
                                        <FormHelperText error style={{ marginLeft: 0, }}>
                                            {formik.touched.password && formik.errors.password}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </MyGrid>
                            <MyGrid onRight={true} item md={6} sm={6} xs={12}>
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                >
                                    <InputLabel htmlFor="verifyPassword">Confirmar senha</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        id="verifyPassword"
                                        name="verifyPassword"
                                        type={showVerifyPassword ? 'text' : 'password'}
                                        value={formik.values.verifyPassword}
                                        onChange={formik.handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowVerifyPassword}
                                                    edge="end"
                                                >
                                                    {showVerifyPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Confirmar senha"
                                        error={Boolean(formik.touched.verifyPassword && formik.errors.verifyPassword)}
                                        inputProps={{ maxLength: 80 }}
                                    />
                                    {Boolean(formik.touched.verifyPassword && formik.errors.verifyPassword) && (
                                        <FormHelperText error style={{ marginLeft: 0, }}>
                                            {formik.touched.verifyPassword && formik.errors.verifyPassword}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </MyGrid>
                            <MyGrid item xs={12}>
                                <S.NewUserTextField
                                    fullWidth
                                    label="E-mail"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.email && formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    inputProps={{ maxLength: 80 }}
                                />
                            </MyGrid>
                        </Grid>
                        <Divider style={{ marginTop: 24, width: '100%' }} />
                        <Grid container spacing={3} alignItems='flex-start' sx={{
                            width: '100%',
                            margin: 0,
                        }}>
                            <MyGrid onLeft={true} item md={6} sm={6} xs={12}>
                                <S.NewUserTextField
                                    fullWidth
                                    label="Estado"
                                    name="state"
                                    value={formik.values.state}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.state && formik.errors.state)}
                                    helperText={formik.touched.state && formik.errors.state}
                                />
                            </MyGrid>
                            <MyGrid onRight={true} item md={6} sm={6} xs={12}>
                                <S.NewUserTextField
                                    fullWidth
                                    label="Cidade"
                                    name="city"
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.city && formik.errors.city)}
                                    helperText={formik.touched.city && formik.errors.city}
                                    inputProps={{ maxLength: 100 }}
                                />
                            </MyGrid>
                            <MyGrid onLeft={true} item md={6} sm={6} xs={12}>
                                <S.NewUserTextField
                                    fullWidth
                                    label="CEP"
                                    name="zipCode"
                                    value={formik.values.zipCode}
                                    onChange={(e) => {
                                        formik.setFieldValue('zipCode', e.target.value.replace(/\D/gi, ''))
                                    }}
                                    error={Boolean(formik.touched.zipCode && formik.errors.zipCode)}
                                    helperText={formik.touched.zipCode && formik.errors.zipCode}
                                    inputProps={{ maxLength: 8 }}
                                />
                            </MyGrid>

                            <MyGrid onRight={true} item md={6} sm={6} xs={12}>
                                <S.NewUserTextField
                                    fullWidth
                                    label="Bairro"
                                    name="_bairro"
                                    value={formik.values._bairro}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched._bairro && formik.errors._bairro)}
                                    helperText={formik.touched._bairro && formik.errors._bairro}
                                    inputProps={{ maxLength: 100 }}
                                />
                            </MyGrid>

                            <MyGrid onLeft={true} item md={6} sm={6} xs={12}>
                                <S.NewUserTextField
                                    fullWidth
                                    label="Rua"
                                    name="_rua"
                                    value={formik.values._rua}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched._rua && formik.errors._rua)}
                                    helperText={formik.touched._rua && formik.errors._rua}
                                    inputProps={{ maxLength: 100 }}
                                />
                            </MyGrid>

                            <MyGrid onRight={true} item md={6} sm={6} xs={12}>
                                <S.NewUserTextField
                                    fullWidth
                                    label="Número"
                                    name="_numero"
                                    value={formik.values._numero}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched._numero && formik.errors._numero)}
                                    helperText={formik.touched._numero && formik.errors._numero}
                                />
                            </MyGrid>

                            <MyGrid onLeft={true} item md={6} sm={6} xs={12}>
                                <S.NewUserTextField
                                    fullWidth
                                    label="Complemento"
                                    name="_complemento"
                                    value={formik.values._complemento}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched._complemento && formik.errors._complemento)}
                                    helperText={formik.touched._complemento && formik.errors._complemento}
                                    inputProps={{ maxLength: 100 }}
                                />
                            </MyGrid>
                            <MyGrid xs={12} item display='flex' justifyContent='space-between' alignItems='center'>
                                <LoadingButton loading={loading} variant='text' onClick={() => navigate('/users')}>
                                    Cancelar
                                </LoadingButton>
                                <LoadingButton loading={loading} type='submit' variant='contained'>
                                    Criar conta
                                </LoadingButton>
                            </MyGrid>
                        </Grid>
                    </S.NewUserGrid>
                </Grid>
            </form>
        </Grid>
    );
}

export default NewUserTemplate;