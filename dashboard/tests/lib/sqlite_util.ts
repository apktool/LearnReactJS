import {exec} from "@/app/lib/sqlite_util";
import {Database, open} from "sqlite";
import sqlite3 from "sqlite3";

test('test say hello', () => {
    const fn = () => {
        return "Hello world"
    }
    expect(fn()).toBe("Hello world")
});

let db_test: Database

beforeEach(async () => {
    db_test = await open({
        filename: '/home/li-pc/Workspace/LearnReactJS/dashboard/data.db',
        driver: sqlite3.Database
    })
})

describe('#all', () => {
    it('db.all(sql)', async () => {
        const fn = async () => {
            const res = await db_test.all('SELECT * FROM customers WHERE id = ?', ['3958dc9e-712f-4377-85e9-fec4b6a6442a'])
            const customer = res[0]
            expect(customer["id"]).toBe("3958dc9e-712f-4377-85e9-fec4b6a6442a")
            expect(customer["name"]).toBe("Delba de Oliveira")
            expect(customer["email"]).toBe("delba@oliveira.com")
            expect(customer["image_url"]).toBe("/customers/delba-de-oliveira.png")
        }
        await fn()
        await db_test.close()
    })
})

describe("#exec", () => {
    it("db.all(sql)", async () => {
        const sql = "SELECT * FROM customers WHERE id = '3958dc9e-712f-4377-85e9-fec4b6a6442a'"
        const res = await exec(sql)
        const customer = res[0]
        expect(customer["id"]).toBe("3958dc9e-712f-4377-85e9-fec4b6a6442a")
        expect(customer["name"]).toBe("Delba de Oliveira")
        expect(customer["email"]).toBe("delba@oliveira.com")
        expect(customer["image_url"]).toBe("/customers/delba-de-oliveira.png")
    })
})