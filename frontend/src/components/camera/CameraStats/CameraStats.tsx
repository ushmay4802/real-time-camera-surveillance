import styles from "./CameraStats.module.css";

interface Props {

    fps: number;

}

const CameraStats = ({ fps }: Props) => {

    return (

        <div className={styles.stats}>

            <span>FPS</span>

            <strong>{fps}</strong>

        </div>

    );

};

export default CameraStats;