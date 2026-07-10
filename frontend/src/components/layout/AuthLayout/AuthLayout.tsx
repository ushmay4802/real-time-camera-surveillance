import styles from "./AuthLayout.module.css";
import Card from "../../common/Card/Card";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

const AuthLayout = ({
    title,
    subtitle,
    children,
}: AuthLayoutProps) => {
    return (
        <div className={styles.container}>

            <Card>

                <h1>{title}</h1>

                <p>{subtitle}</p>

                {children}

            </Card>

        </div>
    );
};

export default AuthLayout;