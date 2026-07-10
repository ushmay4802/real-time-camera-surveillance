import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import styles from "./TopBar.module.css";

const TopBar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <header className={styles.header}>
            <div>
                <h2>Camera Surveillance System</h2>
                <span>Real-Time Monitoring</span>
            </div>

            <nav>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/alerts">Alerts</Link>
                <Link to="/camera-settings">Cameras</Link>
                <button onClick={handleLogout}>Logout</button>
            </nav>
        </header>
    );
};

export default TopBar;
