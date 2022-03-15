import * as bcrypt from 'bcrypt';

export default class BCryptHashProvider {
    public async generate(payload: string): Promise<string> {
        return bcrypt.hash(payload, 10);
    }
  
    public async compare(payload: string, hashed: string): Promise<boolean> {
      return bcrypt.compare(payload, hashed);
    }
  }
  