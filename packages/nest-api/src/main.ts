import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'
import cookieParser from 'cookie-parser'

console.log('NODE ENV:', process.env.NODE_ENV)

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)
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
    app.use(cookieParser())
    useContainer(app.select(AppModule), { fallbackOnErrors: true })
    await app.listen(3001)
}

;(async () => {
    bootstrap()
})()
