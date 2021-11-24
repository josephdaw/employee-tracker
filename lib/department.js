// import requirements
const inquirer = require("inquirer");
const mysql = require('mysql2/promise');
const { newConnection } = require('../config/db')

// display all departments as a table in the console
async function viewAll() {
    const connection = await newConnection()
    const [rows] = await connection.execute('SELECT * FROM departments');
    console.table(rows)
    await connection.end();
}

// add a new department then display all departments as a table in the console
async function addNew() {
    const input = await inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of the Department you would like to add?"
            }
        ])
    const connection = await newConnection()

    const query = `INSERT INTO departments
    (name)
    VALUES
    (?);`;

    await connection.execute(query, [input.name]);
    const [rows] = await connection.execute('SELECT * FROM departments')
    console.table(rows)
    await connection.end();
}

module.exports = { viewAll, addNew }