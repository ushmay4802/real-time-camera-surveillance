import styles from "./LatestAlert.module.css";

interface Props {

    alert: string;

}

const LatestAlert = ({ alert }: Props) => {

    return (

        <div className={styles.alert}>

            <span>Latest Alert</span>

            <strong>{alert}</strong>

        </div>

    );

};

export default LatestAlert;