export enum Database {
    CONFLICTING_RESOURCE = 'database/already_exists',
    MISSING_DOCUMENT = 'database/not_found',
}

export enum Validation {
    MISSING_FIELDS = 'validation/missing_fields',
    INVALID_INPUT = 'validation/failed',
}

export enum Watcher {
    INVALID_QUERY = 'watcher/invalid_query',
}

export enum Auth {
    INVALID_EMAIL = 'auth/invalid_email',
    INVALID_PASSWORD = 'auth/invalid_password',
    INVALID_CREDENTIALS = 'auth/invalid_credentials',
    MISSING_USER = 'auth/no_user_found',
    PASSWORD_NOT_STRONG_ENOUGH = 'auth/password_not_strong_enough',
    PASSWORD_NOT_MATCHING = 'auth/password_not_matching',
    PASSWORD_TOO_LONG = 'auth/password_too_long',
    INVALID_JWT = 'auth/invalid_token',
    MISSING_JWT = 'auth/missing_jwt',
    INVALID_REFRESH_TOKEN = 'auth/invalid_refresh_token',
    USER_ALREADY_EXISTS = 'auth/user_already_exists',
}
