require('dotenv').config();

const inquirer = require("inquirer");

const init = async () => {
    const choice = await inquirer
    .prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: 'action',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee',
                'Exit'
            ]
        }
    ])

    // if (choice.role === 'Engineer') { await this.addEngineer() }
    if (choice.action === 'View All Departments') { console.log("1") }
    if (choice.action === 'View All Roles') { console.log("2") }
    if (choice.action === 'View All Employees') { console.log("3") }
    if (choice.action === 'Add a Department') { console.log("4") }
    if (choice.action === 'Add a Role') { console.log("5") }
    if (choice.action === 'Add an Employee') { console.log("6") }
    if (choice.action === 'Update an Employee') { console.log("7") }
    if (choice.action === 'Exit') { return console.log("Logged Out") }
}

init();