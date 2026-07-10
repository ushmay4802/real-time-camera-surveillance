import TopBar from "../TopBar/TopBar";

import styles from "./DashboardLayout.module.css";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({
    children,
}: DashboardLayoutProps) => {
    return (
        <div className={styles.container} >

            <TopBar />

            < main className={styles.content} >
                {children}
            </main>

        </div>
    );
};

export default DashboardLayout;