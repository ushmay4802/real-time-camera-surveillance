import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout/AuthLayout";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/axios";

import styles from "./Login.module.css";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const justReset = (location.state as { justReset?: boolean } | null)?.justReset;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await login({ email, password });
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(getErrorMessage(err, "Invalid email or password."));
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout title="Camera Surveillance" subtitle="Real-Time Camera Monitoring">
            <form className={styles.form} onSubmit={handleSubmit}>
                {justReset && (
                    <p style={{ color: "var(--success, #1a7f37)" }}>
                        Password reset - log in with your new password.
                    </p>
                )}

                <Input
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={setEmail}
                />

                <Input
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={setPassword}
                />

                {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

                <Button type="submit" loading={isSubmitting}>
                    Login
                </Button>

                <div className={styles.links}>
                    <Link to="/forgot-password">Forgot Password?</Link>
                    <Link to="/register">Create Account</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
