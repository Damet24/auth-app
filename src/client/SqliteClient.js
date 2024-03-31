import sqlite3 from 'sqlite3'
import {HttpError} from "../errors/HttpError.js";
import HttpStatus from "http-status";

export class SqliteClient {
    constructor(connectionString) {
        this._database = new sqlite3.Database(connectionString)
    }

    run(sql, params) {
        return new Promise((resolve, reject) => {
            this._database.serialize(() => {
                this._database.run(sql, params, (err) => {
                    if(err) reject(new HttpError({status: HttpStatus.INTERNAL_SERVER_ERROR, message: err.message, show: false}))
                    resolve()
                })
            })
        })
    }
}