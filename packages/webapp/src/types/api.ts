
export const AuthErrorCodes = {
    INVALID_EMAIL: 'auth/invalid_email',
    INVALID_PASSWORD: 'auth/invalid_password',
    MISSING_USER: 'auth/no_user_found',
    PASSWORD_NOT_STRONG_ENOUGH: 'auth/password_not_strong_enough',
    PASSWORD_NOT_MATCHING: 'auth/password_not_matching',
    PASSWORD_TOO_LONG: 'auth/password_too_long',
    INVALID_JWT: 'auth/invalid_token',
    USER_ALREADY_EXISTS: 'auth/user_already_exists'
}

export const DatabaseErrorCodes = {
    CONFLICTING_RESOURCE: 'database/already_exists',
}

export declare interface APIError {
    error: {
        status: number,
        type: string,
        message: string,
    }
}