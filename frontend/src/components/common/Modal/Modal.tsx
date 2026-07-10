import styles from "./Modal.module.css";

interface ModalProps {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

const Modal = ({
    isOpen,
    title,
    children,
    onClose,
}: ModalProps) => {

    if (!isOpen) return null;

    return (

        <div
            className={styles.overlay}
            onClick={onClose}
        >

            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >

                <div className={styles.header}>

                    <h2>{title}</h2>

                    <button onClick={onClose}>
                        ✕
                    </button>

                </div>

                {children}

            </div>

        </div>

    );

};

export default Modal;