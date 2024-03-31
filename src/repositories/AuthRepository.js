import sqlite3 from 'sqlite3'
import {HttpError} from "../errors/HttpError.js";
import HttpStatus from "http-status";
import {Source} from "../constants/Source.js";

export class AuthRepository {
    constructor(sqliteClient) {
        this._sqliteClient = sqliteClient
    }
    
    async save({id, email, passwordHash}) {
        const sql = `INSERT INTO ${Source.AUTH_TABLE} (id, email, passwordHash) VALUES ('${id}', '${email}', '${passwordHash}')`
        await this._sqliteClient.run(sql)
    }
}