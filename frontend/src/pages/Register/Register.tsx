import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout/AuthLayout";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/axios";

import styles from "./Register.module.css";

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError(null);
        setIsSubmitting(true);
        try {
            await register({ name, email, password });
            navigate("/verify-otp", {
                state: { name, email, password },
            });
        } catch (err) {
            setError(getErrorMessage(err, "Could not create account. Try a different email."));
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout title="Camera Surveillance" subtitle="Create your account">
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input label="Name" value={name} onChange={setName} required />
                <Input label="Email" type="email" value={email} onChange={setEmail} required />
                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    required
                />
                <Input
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    required
                />

                {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

                <Button type="submit" loading={isSubmitting}>
                    Create Account
                </Button>

                <div className={styles.footer}>
                    <span>Already have an account?</span>
                    <Link to="/login">Login</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;
