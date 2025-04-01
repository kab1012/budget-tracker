import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import { login } from '../../services/api';

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }) => {
        const response = await login(email, password);
        localStorage.setItem('token', response.access);
        localStorage.setItem('refreshToken', response.refresh);
        return response;
    }
);

// export const refreshUserToken = createAsyncThunk(
//     'auth/refresh',
//     async (refresh: string) => {
//         const response = await refreshToken(refresh);
//         localStorage.setItem('token', response.access);
//         return response;
//     }
// );

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isAuthenticated = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.token = action.payload.access;
            })
            .addCase(loginUser.rejected, (state) => {
                state.isAuthenticated = false;
                state.token = null;
            });
    },
});

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer; 