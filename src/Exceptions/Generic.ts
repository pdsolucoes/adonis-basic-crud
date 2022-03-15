import { Exception } from '@adonisjs/core/build/standalone'

const statusCodeExceptions = {
    422: 'Unprocessable Entity',
    403: 'Forbidden',
    401: 'Unauthorized',
    400: 'Bad Request',
    500: 'Internal Server Error',
}

export enum StausCode  {
    "InternalServerError" = 500,
    "BadRequest" =  400,
    "Unauthorized" = 401,
    "Forbidden" = 403,
    "UnprocessableEntity" = 422
}


export default class GenericExceptionHandler extends Exception {
    constructor(message: string, status_code: StausCode ) {
        super(message, status_code, statusCodeExceptions[status_code] )
    }
}