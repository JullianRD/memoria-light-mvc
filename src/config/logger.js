import pino from 'pino'
import PinoPretty, { colorizerFactory } from 'pino-pretty'

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = pino(
    {
        level: process.env.LOG_LEVEL || "info", 
        transport: isDevelopment ? {
            target: 'pino-pretty',
            options: {
                colorizerFactory: true,
                translateTime: 'HH:HH:SS'
                ignore: 'pid.'
            }
        }
    }
)