import {io} from 'socket.io-client';
import { getJwtToken } from './utils/token';

export const socket = () => io(import.meta.env.VITE_SOCKET_URL, {
    auth: {
        token: getJwtToken(),
    },
});