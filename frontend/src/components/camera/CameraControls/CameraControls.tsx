import Button from "../../common/Button/Button";

import styles from "./CameraControls.module.css";

const CameraControls = () => {

    return (

        <div className={styles.controls}>

            <Button>

                Start

            </Button>

            <Button variant="danger">

                Stop

            </Button>

        </div>

    );

};

export default CameraControls;