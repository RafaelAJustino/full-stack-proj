import React, { useCallback, useState } from 'react';
import {
    Grid,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Button,
    Typography,
    useTheme,
    FormControlLabel,
    Checkbox,
    Avatar
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as S from './AuthRegister.style'
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthRegister, AuthUser } from '../../../services/auth';
import LoadingButton from '@mui/lab/LoadingButton';
import FormHelperText from '@mui/material/FormHelperText';
import { setJwtToken } from '../../../utils/token';

const initialValues = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    verifyPassword: '',
    checkTerms: false,
};

function AuthRegisterTemplate() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [terms, setTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ show: false, message: '' });

    function verifyError(entry: string) {
        switch (entry) {
            case 'AUTH.ALREADY_EXISTS':
                return 'Usuário existente!';
            default:
                return 'Algo de errado não está certo'
        }
    }

    const submitRequest = useCallback(
        (values: typeof initialValues) => {
            const temp = {
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
            }

            const doLogin = async () => {
                try {
                    setLoading(true);
                    const register = await AuthRegister(temp);
                    if (!!register.token) {
                        const user = await AuthUser({
                            email: values.email,
                            password: values.password,
                        })
                        setJwtToken(user.token);
                        navigate('/');
                    }
                } catch (e: any) {
                    console.log(e.response.data.message);
                    setError({
                        show: true,
                        message: verifyError(e.response.data.message)
                    });
                } finally {
                    setLoading(false);
                }
            };

            doLogin();
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
                .min(4, '* E-mail deve conter pelo menos 4 caracteres')
                .max(80, '* E-mail deve conter no máximo 80 caracteres'),
            password: Yup.string().required('* Campo obrigatório')
                .min(8, '* Senha deve conter pelo menos 8 caracteres'),
            verifyPassword: Yup.string().required('* Campo obrigatório')
                .oneOf([Yup.ref('password'), null], '* Senhas devem ser iguais'),
            firstName: Yup.string().required('* Campo obrigatório')
                .min(2, '* Nome deve conter pelo menos 2 caracteres')
                .max(50, '* Nome deve conter no máximo 50 caracteres'),
            lastName: Yup.string().required('* Campo obrigatório')
                .min(2, '* Sobrenome deve conter pelo menos 2 caracteres')
                .max(50, '* Sobrenome deve conter no máximo 50 caracteres'),
            checkTerms: Yup.bool().required('* Você deve aceitar os termos para prosseguir!')
                .oneOf([true], '* Você deve aceitar os termos para prosseguir!'),
        }),
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClickShowVerifyPassword = () => setShowVerifyPassword((show) => !show);

    return (
        <S.AuthRegisterForm onSubmit={formik.handleSubmit}>
            <S.AuthRegisterGrid container spacing={3} alignItems='center' justifyContent='center' sx={{
                width: '100%',
                margin: 0,
            }}>
                <Grid item xs={12} display="flex" justifyContent="center">
                    <Avatar src="" sx={{ width: 48, height: 48 }} variant='rounded' />
                </Grid>
                <Grid item xs={12} marginBottom={'20px'}>
                    <Typography variant='h1' fontSize={24} letterSpacing={'0.017em'}>
                        Criar uma nova conta
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {error.show && (
                        <FormHelperText
                            error
                            style={{ marginLeft: 0, textAlignLast: 'center' }}
                        >
                            {error.message}
                        </FormHelperText>
                    )}
                </Grid>
                <Grid item md={6} sm={6} xs={12} marginTop={'20px'}>
                    <S.AuthRegisterTextField
                        fullWidth
                        label="Nome"
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                        inputProps={{ maxLength: 50 }}
                    />
                </Grid>
                <Grid item md={6} sm={6} xs={12} marginTop={'20px'}>
                    <S.AuthRegisterTextField
                        fullWidth
                        label="Sobrenome"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                        inputProps={{ maxLength: 50 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <S.AuthRegisterTextField
                        fullWidth
                        label="E-mail"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={Boolean(formik.touched.email && formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        inputProps={{ maxLength: 80 }}
                    />
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
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
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
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
                </Grid>
                <Grid item xs={12} textAlign={'start'}>
                    <S.AuthRegisterFormControlLabel control={
                        <Checkbox
                            value={terms}
                            onChange={(e) => {
                                const temp = e.target.checked
                                setTerms(temp)
                                formik.setFieldValue('checkTerms', temp);
                            }}
                        />
                    }
                        style={{ fontSize: 14 }}
                        label="Concordo com os termos e condições!"
                    />
                    {Boolean(formik.touched.checkTerms && formik.errors.checkTerms) && (
                        <FormHelperText error style={{ marginLeft: 0, }}>
                            {formik.touched.checkTerms && formik.errors.checkTerms}
                        </FormHelperText>
                    )}
                </Grid>
                <Grid xs={12} item display='flex' justifyContent='space-between' alignItems='center'>
                    <S.AuthRegisterTypography color={theme.palette.primary.main} fontWeight={700} fontSize={14} onClick={() => navigate('/login')}>
                        Fazer login
                    </S.AuthRegisterTypography>
                    <LoadingButton loading={loading} type='submit' variant='contained'>
                        Criar conta
                    </LoadingButton>
                </Grid>
            </S.AuthRegisterGrid>
        </S.AuthRegisterForm>
    );
}

export default AuthRegisterTemplate;