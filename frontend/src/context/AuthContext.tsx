import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import * as authService from "../services/authService";
import type {
    AuthTokens,
    ForgotPasswordPayload,
    LoginPayload,
    RegisterPayload,
    ResetPasswordPayload,
    User,
    VerifyRegisterOtpPayload,
} from "../types/auth";

interface AuthContextValue {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
    login: (payload: LoginPayload) => Promise<void>;

    register: (payload: RegisterPayload) => Promise<string>;
    verifyRegisterOtp: (payload: VerifyRegisterOtpPayload) => Promise<void>;
    forgotPassword: (payload: ForgotPasswordPayload) => Promise<string>;
    resetPassword: (payload: ResetPasswordPayload) => Promise<string>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    // Rehydrate from localStorage on first load so a refresh doesn't
    // kick the user back to /login.
    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }
        setIsInitializing(false);
    }, []);

    const persistSession = (tokens: AuthTokens, nextUser: User) => {
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(nextUser));
        setToken(tokens.accessToken);
        setUser(nextUser);
    };

    const login = async (payload: LoginPayload) => {
        const res = await authService.login(payload);
        persistSession(res.tokens, res.user);
    };

    const register = async (payload: RegisterPayload) => {
        const res = await authService.register(payload);
        return res.message;
    };

    const verifyRegisterOtp = async (payload: VerifyRegisterOtpPayload) => {
        const res = await authService.verifyRegisterOtp(payload);
        persistSession(res.tokens, res.user);
    };

    const forgotPassword = async (payload: ForgotPasswordPayload) => {
        const res = await authService.forgotPassword(payload);
        return res.message;
    };

    const resetPassword = async (payload: ResetPasswordPayload) => {
        const res = await authService.resetPassword(payload);
        return res.message;
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated: !!token,
            isInitializing,
            login,
            register,
            verifyRegisterOtp,
            forgotPassword,
            resetPassword,
            logout,
        }),
        [user, token, isInitializing]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
