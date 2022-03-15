import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

export default class User extends BaseModel {
    @column({isPrimary: true})
    public id: number;

    @column()
    public name: string;

    @column()
    public email: string;

    @column({serializeAs: null})
    public password: string;

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime;

}
