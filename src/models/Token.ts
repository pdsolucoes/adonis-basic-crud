import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

export default class Token extends BaseModel {
    @column({isPrimary: true})
    public id: number;

    @column()
    public user_id: number;

    @column()
    public token: string;

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime;

}
