import { IsJWT, IsOptional, IsString } from 'class-validator'

export default class RefreshTokenDto {
    @IsOptional()
    @IsString()
    @IsJWT()
    refresh_token?: string
}
