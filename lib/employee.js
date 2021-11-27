// import requirements
const inquirer = require("inquirer");
const { newConnection } = require('../config/db')

// display all employees as a table in the console
async function viewAll() {
    const connection = await newConnection()
    const [rows] = await connection.execute(`SELECT 
    concat(employees.first_name," ",employees.last_name) as employee_full_name, 
    employees.id,
    roles.title AS role,
    departments.name AS department,
    roles.salary,
    concat(managers.first_name," ",managers.last_name) AS manager_full_name 
    FROM employees LEFT JOIN employees managers 
    ON employees.manager_id=managers.id
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id;`);
    console.table(rows)
    await connection.end();
}

// add a new employee then display all employees as a table in the console
async function addNew() {
    const connection = await newConnection()

    // GET ROLES
    // set the query to return an array of arrays rather than array of objects
    const rolesRows = await connection.query({ sql: `SELECT title FROM roles;`, rowsAsArray: true })
    // extract the arrays containing name information
    const roles = rolesRows[0];
    const roleNames = []
    // iterate through the arrays to extract the names into a single array to pass to inquirer
    roles.forEach(item => roleNames.push(item[0]))

    // get an array of employees
    const employeesNames = await getEmployees();

    const input = await inquirer
        .prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?"
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roleNames
            },
            {
                type: "confirm",
                name: "hasManager",
                message: "Does the employee have a manager?",
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: employeesNames,
                when: (input) => input.hasManager === true,
            },
        ])

    // find the id of the selected employee role
    const [roleQuery] = await connection.execute(`SELECT 
    id 
    FROM company_db.roles
    WHERE title = ?;`, [input.role])

    // set the defaul manager ID to null
    let managerID = null

    // if a manager has been selected:
    if (input.hasManager) {
        // find the id of the selected manager
        const [managerQuery] = await connection.execute(`SELECT 
        employees.id
        FROM employees
        where concat(employees.first_name," ",employees.last_name) = ?;`, [input.manager])
        // update managerID 
        managerID = managerQuery[0].id;
    };


    const query = `INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
    VALUES
    (?, ?, ?, ?);`;
    // adding the new employee into the employee database
    await connection.execute(query, [input.firstName, input.lastName, roleQuery[0].id, managerID]);

    await connection.end();

    console.log(`${input.firstName} ${input.lastName} has been added to employees.`)
} // END OF ADDNEW()

// add a new employee then display all employees as a table in the console
async function updateRole() {
    const connection = await newConnection()

    // GET ROLES
    // set the query to return an array of arrays rather than array of objects
    const rolesRows = await connection.query({ sql: `SELECT title FROM roles;`, rowsAsArray: true })
    // extract the arrays containing name information
    const roles = rolesRows[0];
    const roleNames = []
    // iterate through the arrays to extract the names into a single array to pass to inquirer
    roles.forEach(item => roleNames.push(item[0]))

    // get an array of employees
    const employeesNames = getEmployees();

    const input = await inquirer
        .prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?"
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roleNames
            },
            {
                type: "confirm",
                name: "hasManager",
                message: "Does the employee have a manager?",
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: employeesNames,
                when: (input) => input.hasManager === true,
            },
        ])

    // find the id of the selected manager
    const [roleQuery] = await connection.execute(`SELECT 
    id 
    FROM company_db.roles
    WHERE title = ?;`, [input.role])

    // set the defaul manager ID to null
    const managerID = null

    // if a manager has been selected:
    if (input.hasManager) {
        // find the id of the selected manager
        const [managerQuery] = await connection.execute(`SELECT 
        employees.id
        FROM employees
        where concat(employees.first_name," ",employees.last_name) = ?;`, [input.manager])
        // update managerID 
        managerID = managerQuery[0].id;
    };


    const query = `INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
    VALUES
    (?, ?, ?, ?);`;
    // adding the new employee into the employee database
    await connection.execute(query, [input.firstName, input.lastName, roleQuery[0].id, managerID]);

    await connection.end();
    
    console.log(`${input.firstName} ${input.lastName}'s role has been updated to ${input.role}.`)
} // END OF ADDNEW()

async function getEmployees() {
    const connection = await newConnection()
// GET EMPLOYEES
    // set the query to return an array of arrays rather than array of objects
    const employeeRows = await connection.query({
        sql: `SELECT concat(employees.first_name," ",employees.last_name) as employee_full_name
    FROM company_db.employees;`, rowsAsArray: true
    })
    // extract the arrays containing name information
    const employees = employeeRows[0];
    const employeesNames = []
    // iterate through the arrays to extract the names into a single array to pass to inquirer
    employees.forEach(item => employeesNames.push(item[0]))
    await connection.end();
    return employeesNames
};

module.exports = { viewAll, addNew }

