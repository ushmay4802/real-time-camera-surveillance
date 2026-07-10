import styles from "./Input.module.css";

interface InputProps {
    id?: string;
    name?: string;

    label: string;

    type?: string;

    placeholder?: string;

    value: string;

    required?: boolean;

    disabled?: boolean;

    autoComplete?: string;

    error?: string;

    onChange: (value: string) => void;
}

const Input = ({
    id,
    name,
    label,
    type = "text",
    placeholder,
    value,
    required = false,
    disabled = false,
    autoComplete,
    error,
    onChange,
}: InputProps) => {
    return (
        <div className={styles.container}>

            <label
                htmlFor={id}
                className={styles.label}
            >
                {label}
            </label>

            <input
                id={id}
                name={name}
                className={`${styles.input} ${error ? styles.errorInput : ""
                    }`}
                type={type}
                placeholder={placeholder}
                value={value}
                required={required}
                disabled={disabled}
                autoComplete={autoComplete}
                onChange={(e) => onChange(e.target.value)}
            />

            {error && (
                <span className={styles.error}>
                    {error}
                </span>
            )}

        </div>
    );
};

export default Input;