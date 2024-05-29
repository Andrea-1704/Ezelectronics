import { test, expect } from "@jest/globals"
import db from "../src/db/db"

test("1", () => {
    console.log(db)
    expect(1).toBe(1)
})