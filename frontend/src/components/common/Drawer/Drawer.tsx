import styles from "./Drawer.module.css";

interface DrawerProps {
    open: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

const Drawer = ({
    open,
    title,
    children,
    onClose,
}: DrawerProps) => {

    return (

        <>

            {open && (
                <div
                    className={styles.overlay}
                    onClick={onClose}
                />
            )}

            <aside
                className={`${styles.drawer} ${open ? styles.open : ""
                    }`}
            >

                <div className={styles.header}>

                    <h2>{title}</h2>

                    <button onClick={onClose}>
                        ✕
                    </button>

                </div>

                {children}

            </aside>

        </>

    );

};

export default Drawer;