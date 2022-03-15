
import Env from '@ioc:Adonis/Core/Env'
import * as jwt from 'jsonwebtoken';

export default class JWTProvider {
    generateToken(payload: string) {
      return jwt.sign({ user_id: payload }, Env.get('SECRET_JWT'), {
        expiresIn: '7d',
      });
    }
  
    decodeToken(token: string) {
      return jwt.verify(token, Env.get('SECRET_JWT'));
    }
  }