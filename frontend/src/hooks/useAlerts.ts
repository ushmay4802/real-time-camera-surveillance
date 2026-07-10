import { useCallback, useEffect, useState } from "react";

import * as alertService from "../services/alertService";
import type { Alert, AlertFilters } from "../types/alert";

const useAlerts = (
    initialFilters: AlertFilters = {},
) => {

    const [alerts, setAlerts] =
        useState<Alert[]>([]);

    const [nextCursor, setNextCursor] =
        useState<string | null>(null);

    const [cursorHistory, setCursorHistory] =
        useState<string[]>([]);

    const [filters, setFilters] =
        useState<AlertFilters>({
            limit: 20,
            ...initialFilters,
        });

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const load = useCallback(async () => {

        setIsLoading(true);
        setError(null);

        try {

            const response =
                await alertService.listAlerts(
                    filters,
                );
            console.log(response.items)
            setAlerts(
                response.items,
            );

            setNextCursor(
                response.nextCursor,
            );

        } catch (err) {

            setError(
                "Failed to load alerts.",
            );

            console.error(err);

        } finally {

            setIsLoading(false);

        }

    }, [filters]);

    useEffect(() => {

        load();

    }, [load]);

    const updateFilters = (
        next: Partial<AlertFilters>,
    ) => {

        setFilters((prev) => ({

            ...prev,

            ...next,

        }));

    };

    const resetFilters = (
        next: Partial<AlertFilters>,
    ) => {

        setCursorHistory([]);

        setNextCursor(null);

        setFilters((prev) => ({

            ...prev,

            ...next,

            cursor: undefined,

        }));

    };

    const nextPage = () => {

        if (!nextCursor) {
            return;
        }

        setCursorHistory((prev) => [

            ...prev,

            filters.cursor ?? "",

        ]);

        updateFilters({

            cursor: nextCursor,

        });

    };

    const previousPage = () => {

        if (cursorHistory.length === 0) {
            return;
        }

        const history = [...cursorHistory];

        const previous = history.pop();

        setCursorHistory(
            history,
        );

        updateFilters({

            cursor:
                previous || undefined,

        });

    };

    const refresh = () => {

        setCursorHistory([]);

        setNextCursor(null);

        updateFilters({

            cursor: undefined,

        });

    };

    return {

        alerts,

        filters,

        updateFilters,

        resetFilters,

        nextCursor,

        cursorHistory,

        nextPage,

        previousPage,

        refresh,

        isLoading,

        error,

    };

};

export default useAlerts;