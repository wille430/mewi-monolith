import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            exceptionFactory: (errors: ValidationError[] = []) => {
                return new BadRequestException(errors)
            },
        })
    )
    useContainer(app.select(AppModule), { fallbackOnErrors: true })
    await app.listen(3000)
}

console.log('NODE ENV:', process.env.NODE_ENV)
;(async () => {
    bootstrap()
})()
