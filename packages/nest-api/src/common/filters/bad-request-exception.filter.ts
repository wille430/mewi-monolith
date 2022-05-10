import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common'
import { BadRequestResponse } from '@wille430/common'

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest()
        const status = exception.getStatus()

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: [],
            path: request.url,
        } as BadRequestResponse)
    }
}
