import type { WatcherMetadata } from "@mewi/entities";
import { FormError } from "@/lib/types/forms";

export const handleError = (e: any): FormError<WatcherMetadata> => {
    const errors: FormError<WatcherMetadata> = {};

    if (e.statusCode == 409) {
        errors.all = "En bevakning med samma filter finns redan";
    }

    return errors;
};
