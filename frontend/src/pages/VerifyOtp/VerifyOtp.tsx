import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout/AuthLayout";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/axios";

import styles from "./VerifyOtp.module.css";

interface RegisterHandoffState {
    name: string;
    email: string;
    password: string;
}

const RESEND_COOLDOWN_SECONDS = 30;

const VerifyOtp = () => {
    const { register, verifyRegisterOtp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // The Register page hands off {name,email,password} via router
    // state - if someone lands here directly (refresh, bookmark) that
    // state is gone, so send them back to register instead of showing
    // a broken form with no email to verify.
    const handoff = location.state as RegisterHandoffState | null;

    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    if (!handoff) {
        return (
            <AuthLayout title="Verify your email" subtitle="Something went wrong">
                <p>We couldn't find a registration in progress.</p>
                <Link to="/register">Go back to Register</Link>
            </AuthLayout>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await verifyRegisterOtp({ email: handoff.email, otp });
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(getErrorMessage(err, "Invalid or expired code. Try again."));
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        setError(null);
        setInfo(null);
        setIsResending(true);
        try {
            // Calling /auth/register again with the same details simply
            // overwrites the pending OTP in Redis and e-mails a new one -
            // that's the whole "resend" mechanism, no extra endpoint needed.
            await register(handoff);
            setInfo("A new code has been sent to your email.");
            setCooldown(RESEND_COOLDOWN_SECONDS);
        } catch (err) {
            setError(getErrorMessage(err, "Could not resend the code. Try again shortly."));
            console.error(err);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <AuthLayout
            title="Verify your email"
            subtitle={`Enter the 6-digit code sent to ${handoff.email}`}
        >
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                    label="Verification Code"
                    value={otp}
                    onChange={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    required
                />
                <p className={styles.hint}>Code expires 5 minutes after it's sent.</p>

                {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
                {info && <p style={{ color: "var(--success, #1a7f37)" }}>{info}</p>}

                <Button type="submit" loading={isSubmitting} disabled={otp.length !== 6}>
                    Verify & Continue
                </Button>

                <div className={styles.footer}>
                    <span>Didn't get the code?</span>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending || cooldown > 0}
                    >
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default VerifyOtp;
