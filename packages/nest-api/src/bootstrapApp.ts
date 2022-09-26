import {
    BadRequestException,
    INestApplication,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common'
import { useContainer } from 'class-validator'
import { AppModule } from './app.module'

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
    useContainer(app.select(AppModule), { fallbackOnErrors: true })
}
