import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout/AuthLayout";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/axios";

import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
    const { forgotPassword } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await forgotPassword({ email });
            navigate("/reset-password", { state: { email } });
        } catch (err) {
            setError(getErrorMessage(err, "Could not send reset code. Check the email and try again."));
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Forgot Password"
            subtitle="We'll email you a one-time code to reset your password."
        >
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    required
                />

                {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

                <Button type="submit" loading={isSubmitting}>
                    Send Reset Code
                </Button>

                <div className={styles.footer}>
                    <Link to="/login">Back to Login</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;
