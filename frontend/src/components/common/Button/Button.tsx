import styles from "./Button.module.css";

interface ButtonProps {
    type?: "button" | "submit" | "reset";
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: "primary" | "secondary" | "danger";
}

const Button = ({
    type = "button",
    children,
    onClick,
    disabled = false,
    loading = false,
    variant = "primary",
}: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${styles.button} ${styles[variant]}`}
        >
            {loading ? "Please wait..." : children}
        </button>
    );
};

export default Button;