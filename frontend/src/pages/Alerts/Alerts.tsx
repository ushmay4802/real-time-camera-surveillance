import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout/DashboardLayout";
import AlertFilterBar from "../../components/alerts/AlertFilterBar/AlertFilterBar";
import type { TimeRangePreset } from "../../components/alerts/AlertFilterBar/AlertFilterBar";
import AlertList from "../../components/alerts/AlertList/AlertList";
import Button from "../../components/common/Button/Button";

import useAlerts from "../../hooks/useAlerts";
import useCameras from "../../hooks/useCameras";

import styles from "./Alerts.module.css";

const rangeToIso = (
    range: TimeRangePreset,
): {
    from?: string;
    to?: string;
} => {

    if (range === "all") {
        return {};
    }

    const now = new Date();
    const from = new Date(now);

    if (range === "1h") {
        from.setHours(now.getHours() - 1);
    } else if (range === "24h") {
        from.setHours(now.getHours() - 24);
    } else if (range === "7d") {
        from.setDate(now.getDate() - 7);
    } else if (range === "today") {
        from.setHours(0, 0, 0, 0);
    }

    return {
        from: from.toISOString(),
        to: now.toISOString(),
    };

};

const Alerts = () => {

    const { cameras } = useCameras();

    const [cameraId, setCameraId] =
        useState("");

    const [range, setRange] =
        useState<TimeRangePreset>("24h");

    const {

        alerts,

        resetFilters,

        nextCursor,

        cursorHistory,

        nextPage,

        previousPage,

        isLoading,

        error,

        refresh,

    } = useAlerts({

        limit: 20,

        ...rangeToIso("24h"),

    });

    const applyFilters = (
        nextCameraId: string,
        nextRange: TimeRangePreset,
    ) => {

        resetFilters({

            cameraId:
                nextCameraId || undefined,

            ...rangeToIso(nextRange),

        });

    };

    const handleCameraChange = (
        nextCameraId: string,
    ) => {

        setCameraId(
            nextCameraId,
        );

        applyFilters(
            nextCameraId,
            range,
        );

    };

    const handleRangeChange = (
        nextRange: TimeRangePreset,
    ) => {

        setRange(
            nextRange,
        );

        applyFilters(
            cameraId,
            nextRange,
        );

    };

    return (

        <DashboardLayout>

            <div className={styles.container}>

                <h1>
                    Alert History
                </h1>

                <AlertFilterBar

                    cameras={cameras}

                    selectedCameraId={cameraId}

                    selectedRange={range}

                    onCameraChange={handleCameraChange}

                    onRangeChange={handleRangeChange}

                    onRefresh={refresh}

                />

                {

                    isLoading &&

                    <p>
                        Loading alerts...
                    </p>

                }

                {

                    error &&

                    <p className={styles.error}>
                        {error}
                    </p>

                }

                {

                    !isLoading &&
                    !error &&

                    <>

                        <div className={styles.header}>

                            <span>
                                Time
                            </span>

                            <span>
                                Camera Name
                            </span>

                            <span>
                                Location
                            </span>

                            <span>
                                Alert
                            </span>

                        </div>

                        <AlertList
                            alerts={alerts}
                        />

                        <div className={styles.pagination}>

                            <Button
                                variant="secondary"
                                disabled={
                                    cursorHistory.length === 0
                                }
                                onClick={
                                    previousPage
                                }
                            >
                                Previous
                            </Button>

                            <Button
                                variant="secondary"
                                disabled={
                                    !nextCursor
                                }
                                onClick={
                                    nextPage
                                }
                            >
                                Next
                            </Button>

                        </div>

                    </>

                }

            </div>

        </DashboardLayout>

    );

};

export default Alerts;