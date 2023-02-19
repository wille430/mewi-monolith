import type { UpdateEmailDto } from "@/lib/modules/users/dto/update-email.dto";

export const handleError = (e: any) => {
    const newErrors: Partial<Record<keyof UpdateEmailDto, string>> = {};
    for (const error of e.message) {
        for (const constraint of Object.keys(error.constraints)) {
            switch (constraint) {
                case "isEmail":
                    newErrors.newEmail = "Felaktig e-postadress";
                    break;
                case "UniqueEmail":
                    newErrors.newEmail = "E-postadressen är upptagen";
                    break;
            }
        }
    }
    return newErrors;
};
