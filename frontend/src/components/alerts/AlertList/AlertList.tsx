import AlertListItem from "../AlertListItem/AlertListItem";

import type { Alert } from "../../../types/alert";

interface Props {

    alerts: Alert[];

}

const AlertList = ({ alerts }: Props) => {

    return (

        <>

            {alerts.map((alert) => (

                <AlertListItem

                    key={alert.id}

                    alert={alert}

                />

            ))}

        </>

    );

};

export default AlertList;