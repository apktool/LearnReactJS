import {open} from "sqlite";
import sqlite3 from "sqlite3";

const sqlite_db: string = '/home/li-pc/Workspace/LearnReactJS/dashboard/data.db'

export async function exec(sql: string) {
    const res = open({
        filename: sqlite_db,
        driver: sqlite3.Database
    }).then((db) => {
        return db.all(sql)
    })

    return res
}

export async function run(sql: string) {
    const res = open({
        filename: sqlite_db,
        driver: sqlite3.Database
    }).then((db) => {
        return db.run(sql)
    })

    return res
}
