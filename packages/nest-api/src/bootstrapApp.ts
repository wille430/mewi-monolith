import {
    BadRequestException,
    INestApplication,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common'

export const bootstrapApp = (app: INestApplication) => {
    app.enableCors({
        credentials: true,
        origin: true,
    })
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            forbidUnknownValues: true,
            whitelist: true,
            exceptionFactory: (errors: ValidationError[] = []) => {
                return new BadRequestException(errors)
            },
        })
    )
}
