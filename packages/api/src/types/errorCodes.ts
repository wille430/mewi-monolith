

export class APIError {
    status?: string
    type?: string
    message?: string
    
    constructor(status, type?, message?) {
        this.status = status
        this.type = type
        this.message = message
    }

}

export const AuthErrorCodes = {
    INVALID_EMAIL: 'auth/invalid_email',
    INVALID_PASSWORD: 'auth/invalid_password',
    MISSING_USER: 'auth/no_user_found',
    PASSWORD_NOT_STRONG_ENOUGH: 'auth/password_not_strong_enough',
    PASSWORD_NOT_MATCHING: 'auth/password_not_matching',
    PASSWORD_TOO_LONG: 'auth/password_too_long',
    INVALID_JWT: 'auth/invalid_token',
    MISSING_JWT: 'auth/missing_jwt',
    USER_ALREADY_EXISTS: 'auth/user_already_exists'
}

export const DatabaseErrorCodes = {
    CONFLICTING_RESOURCE: 'database/already_exists',
    MISSING_DOCUMENT: 'database/not_found'
}

export const ValidationErrorCodes = {
    MISSING_FIELDS: 'validation/missing_fields',
    INVALID_INPUT: 'validation/failed'
}

export type JWT = string