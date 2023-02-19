export const getPwdValidationErrorMsg = (constraint: string) => {
    switch (constraint) {
        case "matches":
            return "Lösenordet är för svagt";
        case "minLength":
            return "Lösenordet måste minsta vara 8 tecken långt";
        case "isNotEmpty":
            return "Fältet kan inte vara tomt";
        case "maxLength":
            return "Lösenordet kan max vara 20 tecken långt";
    }
};
