import type { AxiosRequestConfig } from 'axios'

export interface CreateConfigFunction {
    (page: number): Promise<AxiosRequestConfig> | AxiosRequestConfig
}
