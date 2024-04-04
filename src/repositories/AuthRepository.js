import {Source} from "../constants/Source.js";

export class AuthRepository {
    /**
     * @param {SqliteClient} sqliteClient
     */
    constructor(sqliteClient) {
        this._sqliteClient = sqliteClient
    }
    
    async save({id, email, passwordHash}) {
        const sql = `INSERT INTO ${Source.AUTH_TABLE} (id, email, passwordHash) VALUES ('${id}', '${email}', '${passwordHash}')`
        await this._sqliteClient.run(sql)
    }

    async getByEmail({email}) {
        const sql = `SELECT * FROM ${Source.AUTH_TABLE} WHERE email='${email}'`
        return await this._sqliteClient.runQuerySingle(sql)
    }
}