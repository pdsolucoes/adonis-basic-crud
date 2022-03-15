import NewHttpContract from '../Dtos/index';
import GenericExceptionHandler, { StausCode } from '../Exceptions/Generic';
import JWTProvider from '../Providers/jwtProvider';

interface JwtPayload {
    user_id: string;
    iat: number;
    exp: number;
  }


class Auth {

    public async authenticate({request}: NewHttpContract, next) {
        try {
            const authHeader = request.header('Authorization');

            if (!authHeader) {
                throw new GenericExceptionHandler('Missing JWT token',StausCode.Unauthorized )
              }

              const token = authHeader.split(' ')[1];
              const jwtProvider = new JWTProvider()

              const decoded = jwtProvider.decodeToken(token) as JwtPayload;
  
              if (!decoded) {
                throw new GenericExceptionHandler('Invalid JWT token',StausCode.Forbidden )
              }
              
              request.user = { id: decoded.user_id };
        
              await next()
        }
        catch (e) {
            if (e instanceof Error) {
              throw e;
            }
            throw new GenericExceptionHandler('Invalid JWT token',StausCode.Forbidden )
          }
    }
}

export default new Auth()