import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout/AuthLayout";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/axios";

import styles from "./ResetPassword.module.css";

interface ForgotPasswordHandoffState {
    email: string;
}

const ResetPassword = () => {
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handoff = location.state as ForgotPasswordHandoffState | null;

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!handoff) {
        return (
            <AuthLayout title="Reset Password" subtitle="Something went wrong">
                <p>We couldn't find a password reset in progress.</p>
                <Link to="/forgot-password">Go back and request a code</Link>
            </AuthLayout>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError(null);
        setIsSubmitting(true);
        try {
            // resetPassword doesn't return a session (user still has to
            // log in with the new password) - it just confirms success.
            await resetPassword({ email: handoff.email, otp, password });
            navigate("/login", {
                replace: true,
                state: { justReset: true },
            });
        } catch (err) {
            setError(getErrorMessage(err, "Could not reset password. Check the code and try again."));
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle={`Enter the code sent to ${handoff.email} and choose a new password`}
        >
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                    label="Verification Code"
                    value={otp}
                    onChange={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    required
                />

                <Input
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    required
                />

                <Input
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    required
                />

                {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

                <Button type="submit" loading={isSubmitting} disabled={otp.length !== 6}>
                    Reset Password
                </Button>

                <div className={styles.footer}>
                    <Link to="/login">Back to Login</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;
