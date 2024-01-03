import sqlite3 from 'sqlite3'
import {open} from 'sqlite'

export async function openDb() {
    return open({
        filename: '/home/li-pc/Workspace/LearnReactJS/dashboard/data.db',
        driver: sqlite3.Database
    })
}

export default async function Home() {
    const db = await openDb()
    const result = await db.all('SELECT * FROM customers')
    console.log(result)


    return (
        <main>
            <h1>Hello world</h1>
        </main>
    )
}
