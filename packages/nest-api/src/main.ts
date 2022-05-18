import { NestFactory } from '@nestjs/core'
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'
import cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

console.log('NODE ENV:', process.env.NODE_ENV)

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('Mewi API')
        .setDescription('The Mewi API documentation')
        .setVersion('0.0.0')
        .addTag('mewi')
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

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
    await app.listen(process.env.PORT || 3001)
}

;(async () => {
    bootstrap()
})()
