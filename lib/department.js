// import requirements
const inquirer = require("inquirer");
const { newConnection } = require('../config/db')

// display all departments as a table in the console
async function viewAll() {
    const connection = await newConnection()
    const [rows] = await connection.execute(`SELECT * FROM departments`);
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
    await connection.end();
    console.log(`${input.name} added to departments.`)
}

// display all departments as a table in the console
async function utilisedBudget() {
    const connection = await newConnection()
    // get all the department names from the db
    const [departmentNames] = await connection.execute(`SELECT name FROM departments`)

    const input = await inquirer
        .prompt([
            {
                type: "list",
                name: "department",
                message: "Which department would you like to view the budget for?",
                choices: departmentNames
            }
        ])

    const departmentID = await getDepartmentID(input.department)
    const [rows] = await connection.execute(`SELECT sum(salary) AS total_budget FROM company_db.roles
    WHERE department_id = ?;`, [departmentID]);
    console.table(rows)
    await connection.end();
}

// function to return a Role ID based on Role Name
async function getDepartmentID(department) {
    const connection = await newConnection()

    // find the id of the selected employee role
    const [departmentQuery] = await connection.execute(`SELECT 
     id 
     FROM company_db.departments
     WHERE name = ?;`, [department])

    await connection.end();
    return departmentQuery[0].id
}

module.exports = { viewAll, addNew, utilisedBudget }