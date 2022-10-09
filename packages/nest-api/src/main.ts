import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { bootstrapApp } from './bootstrapApp'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)
    bootstrapApp(app)

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('Mewi API')
        .setDescription('The Mewi API documentation')
        .setVersion('0.0.0')
        .addTag('mewi')
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    app.use(cookieParser())

    await app.listen(process.env.PORT ?? 3001)
}

;(async () => {
    bootstrap()
})()
