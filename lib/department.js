// import requirements
const inquirer = require("inquirer");
const { newConnection } = require('../config/db')

const table = 'departments'

// display all departments as a table in the console
async function viewAll() {
    const connection = await newConnection()
    const [rows] = await connection.execute(`SELECT * FROM ${table}`);
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

    const query = `INSERT INTO ${table}
    (name)
    VALUES
    (?);`;

    await connection.execute(query, [input.name]);
    const [rows] = await connection.execute(`SELECT * FROM ${table}`)
    console.table(rows)
    await connection.end();
}

module.exports = { viewAll, addNew }