// import requirements
const inquirer = require("inquirer");
const { newConnection } = require('../config/db')

// display all roles as a table in the console
async function viewAll() {
    const connection = await newConnection()
    const [rows] = await connection.execute(`SELECT title, roles.id, name AS department, salary FROM company_db.roles
    JOIN departments ON roles.department_id = departments.id`);
    console.table(rows)
    await connection.end();
}

// add a new role then display all roles as a table in the console
async function addNew() {
    const connection = await newConnection()
    // get all the department names from the db
    const [departmentNames] = await connection.execute(`SELECT name FROM departments`)
    console.log(departmentNames)
    const input = await inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of the Role?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of the Role?"
            },
            {
                type: "list",
                name: "department",
                message: "Which department does the role belong to?",
                choices: departmentNames
            },
        ])
    // find the id of the selected department
    const [rows] = await connection.execute(`SELECT id FROM company_db.departments
    WHERE name='${input.department}';`)

    const query = `INSERT INTO roles
    (title, salary, department_id)
    VALUES
    (?, ?, ?);`;

    await connection.execute(query, [input.name, input.salary, rows[0].id]);
    await connection.end();
    await viewAll()
}

module.exports = { viewAll, addNew }

