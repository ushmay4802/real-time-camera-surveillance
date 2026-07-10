import api from "../api/axios";

import type {
    AlertFilters,
    AlertPage,
} from "../types/alert";

export const listAlerts = async (
    filters: AlertFilters = {},
): Promise<AlertPage> => {

    const { data } =
        await api.get<AlertPage>(
            "/alerts",
            {

                params: {

                    cameraId:
                        filters.cameraId || undefined,

                    from:
                        filters.from || undefined,

                    to:
                        filters.to || undefined,

                    cursor:
                        filters.cursor || undefined,

                    limit:
                        filters.limit ?? 20,

                },

            },
        );

    return data;

};