import { IsJWT, IsOptional, IsString } from 'class-validator'

export default class RefreshTokenDto {
    @IsString()
    @IsJWT()
    @IsOptional()
    refresh_token?: string
}
