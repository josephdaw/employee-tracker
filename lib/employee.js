// import requirements
const inquirer = require("inquirer");
const { newConnection } = require('../config/db')
const { getRoles, getRoleID } = require('./role')

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

    // get an array of roles
    const roleNames = await getRoles();

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
    const roleID = await getRoleID(input.role)

    // set the defaul manager ID to null
    let managerID = null

    // if a manager has been selected:
    if (input.hasManager) { managerID = await getManagerID(input.manager); };

    const query = `INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
    VALUES
    (?, ?, ?, ?);`;
    // adding the new employee into the employee database
    await connection.execute(query, [input.firstName, input.lastName, roleID, managerID]);

    await connection.end();

    console.log(`${input.firstName} ${input.lastName} has been added to employees.`)
} // END OF ADDNEW()

// add a new employee then display all employees as a table in the console
async function updateRole() {
    const connection = await newConnection()

    // get an array of employees
    const employeesNames = await getEmployees();

    // get an array of roles
    const roleNames = await getRoles();

    const input = await inquirer
        .prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee would you like to update?",
                choices: employeesNames,
            },
            {
                type: "list",
                name: "role",
                message: `Which role would you like to assign to selected employee?`,
                choices: roleNames
            },
        ])

    // get role id based on role name
    const roleID = await getRoleID(input.role)

    const query = `UPDATE employees
    SET role_id = ?
    WHERE concat(employees.first_name," ",employees.last_name) = ?;`;

    // adding the new employee into the employee database
    await connection.execute(query, [roleID, input.employee]);

    await connection.end();

    console.log(input.employee, "has now been assigned to", input.role)
} // END OF ADDNEW()

async function getEmployees() {
    const connection = await newConnection()

    // set the query to return an array of arrays rather than array of objects
    const employeeRows = await connection.query({
        sql: `SELECT concat(employees.first_name," ",employees.last_name) as employee_full_name
    FROM company_db.employees;`, rowsAsArray: true
    })
    // extract the arrays containing name information
    const employees = employeeRows[0];
    // const employeesNames = []
    // // iterate through the arrays to extract the names into a single array to pass to inquirer
    // employees.forEach(item => employeesNames.push(item[0]))
    const employeesNames = employees.map(item => item[0])
    
    await connection.end();
    return employeesNames
};

async function getManagerID(managerName){
    const connection = await newConnection()
    // find the id of the selected manager
    const [managerQuery] = await connection.execute(`SELECT 
    employees.id
    FROM employees
    WHERE concat(employees.first_name," ",employees.last_name) = ?;`, [managerName])
    await connection.end();

    return managerQuery[0].id;
};


module.exports = { viewAll, addNew, updateRole, getEmployees, getManagerID }

