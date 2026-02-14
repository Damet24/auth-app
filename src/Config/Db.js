import sqlite3 from "sqlite3";
import {open} from "sqlite";
import {env} from "./env.js";

export async function createDb() {
    const db = await open({
        filename: env.sqlitePath,
        driver: sqlite3.Database
    });

    await db.exec("PRAGMA foreign_keys = ON");

    return db;
}
