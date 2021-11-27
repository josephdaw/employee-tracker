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
    console.log(`${input.name} added to roles.`)
}

// function to return a array of role names
async function getRoles() {
    const connection = await newConnection()

    // set the query to return an array of arrays rather than array of objects
    const rolesRows = await connection.query({ sql: `SELECT title FROM roles;`, rowsAsArray: true })
    // extract the arrays containing name information
    const roles = rolesRows[0];
    const roleNames = []
    // iterate through the arrays to extract the names into a single array to pass to inquirer
    roles.forEach(item => roleNames.push(item[0]))
    await connection.end();
    return roleNames
};

// function to return a Role ID based on Role Name
async function getRoleID(role) {
    const connection = await newConnection()

     // find the id of the selected employee role
     const [roleQuery] = await connection.execute(`SELECT 
     id 
     FROM company_db.roles
     WHERE title = ?;`, [role])

    await connection.end();
    return roleQuery[0].id
}

module.exports = { viewAll, addNew, getRoles, getRoleID }

