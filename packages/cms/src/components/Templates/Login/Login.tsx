import React, { useCallback, useState, useEffect } from 'react';
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
    Snackbar,
    Alert,
    Avatar,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as S from './Login.style'
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthUser } from '../../../services/auth';
import LoadingButton from '@mui/lab/LoadingButton';
import FormHelperText from '@mui/material/FormHelperText';
import { getJwtToken, setJwtToken, setUser } from '../../../utils/token';

const initialValues = {
    email: '',
    password: '',
};

function LoginTemplate() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!loading && getJwtToken() !== null) {
            navigate('/')
        }
    }, [loading, navigate])

    const submitRequest = useCallback(
        (values: typeof initialValues) => {
            const doLogin = async () => {
                try {
                    setError(false);
                    setMessage('')
                    setLoading(true);
                    const user = await AuthUser(values);
                    setJwtToken(user.token);
                    setUser(JSON.stringify({id: user.id}))
                    navigate('/');
                    window.location.reload();
                } catch (e: any) {
                    if (e.response.data.message == 'AUTH.UNAUTHORIZED') {
                        setError(true)
                        setMessage('Login inválido. Tente novamente!')
                    } else if (e.response.data.message == 'AUTH.INVALID_ACCESS'){
                        setError(true)
                        setMessage('Usuário Inexistente ou Desativado!')
                    }
                } finally {
                    setLoading(false);
                }
            };

            doLogin();
        },
        [],
    );

    const formik = useFormik({
        initialValues,
        onSubmit: submitRequest,
        validationSchema: Yup.object().shape({
            email: Yup.string().required('* Campo obrigatório').email('* E-mail inválido'),
            password: Yup.string().required('* Campo obrigatório'),
        }),
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <S.LoginMainGrid>
            <form onSubmit={formik.handleSubmit}>
                <S.LoginGrid container alignItems='center' justifyContent='center'>
                    <Grid item xs={12} display="flex" justifyContent="center">
                        <Avatar src="" sx={{ width: 48, height: 48 }} variant='rounded' />
                    </Grid>
                    <Grid item xs={12} marginBottom={'20px'}>
                        <Typography variant='h1' fontSize={24} letterSpacing={'0.017em'}>
                            Faça login pra continuar
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {error && (
                            <FormHelperText
                                error
                                style={{ marginLeft: 0, textAlignLast: 'center' }}
                            >
                                {message}
                            </FormHelperText>
                        )}
                    </Grid>
                    <Grid item xs={12} marginTop={'20px'}>
                        <S.LoginTextField
                            fullWidth
                            label="E-mail"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={Boolean(formik.touched.email && formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>
                    <Grid item xs={12}>
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
                            />
                            {Boolean(formik.touched.password && formik.errors.password) && (
                                <FormHelperText error style={{ marginLeft: 0, }}>
                                    {formik.touched.password && formik.errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid xs={12} item display='flex' justifyContent='space-between' alignItems='center'>
                        <S.LoginTypography color={theme.palette.primary.main}>
                            Esqueceu a senha?
                        </S.LoginTypography>
                        <LoadingButton loading={loading} type='submit' variant='contained'>
                            login
                        </LoadingButton>
                    </Grid>
                </S.LoginGrid>
            </form>
            <Typography
                marginTop='1.5rem'
                fontWeight={700}
                fontSize={14}
                display={'flex'}
                justifyContent={'center'}
            >
                Precisa de uma conta?
                <S.LoginTypography color={theme.palette.primary.main} onClick={() => navigate('/auth-register')}>
                    Registre-se!
                </S.LoginTypography>
            </Typography>
            {/* <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={error}
                onClose={() => setError(false)}
                autoHideDuration={6000}
            >
                <Alert severity="error">{message}</Alert>
            </Snackbar> */}
        </S.LoginMainGrid>
    );
}

export default LoginTemplate;