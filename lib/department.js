require('dotenv').config();

const inquirer = require("inquirer");
const mysql = require('mysql2/promise');

async function viewAll() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    const [rows] = await conn.execute('SELECT * FROM departments');
    console.table(rows)
    await conn.end();
}

async function addNew() {
    const input = await inquirer
    .prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the Department you would like to add?"
        }
    ])
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const query = `INSERT INTO departments
    (name)
    VALUES
    (?);`;

    await conn.execute(query, [input.name]);
    const [rows] = await conn.execute('SELECT * FROM departments')
    console.table(rows)
    await conn.end();
}

module.exports = { viewAll, addNew }