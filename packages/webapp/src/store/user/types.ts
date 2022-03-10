export interface UserState {
    email?: string
    
}

export enum UserActionType {
    UPDATE_INFO = 'user/update_info',
    FETCH_USER_INFO = 'user/fetch_info',
    FORGOTTEN_PASSWORD = 'user/forgotten_password',
    CHANGE_PASSWORD = 'user/password/reset',
}
