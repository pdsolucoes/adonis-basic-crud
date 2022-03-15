import Database from "@ioc:Adonis/Lucid/Database";
import Token from "../models/Token";

class TokenRepository {
    public async createToken({user_id, token}): Promise<Token> {
        const newToken = await Token.create({user_id, token})
        return newToken
    }

    public async findBytoken(token: string): Promise<Token | null> {
        const tokenInDatabase =await Token.findBy('token', token)
        return tokenInDatabase
    }

    public async deleteAllTokensByUser(user_id):Promise<void> {
        await Database.rawQuery(
            'delete from tokens t where t.user_id = ?', [user_id]
        )       
    }

    public async deleteByToken(token):Promise<void> {
        await Database.rawQuery(
            'delete from tokens t where t.token= ?', [token]
        )   
    }
}

export default new TokenRepository()