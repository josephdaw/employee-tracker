const inquirer = require("inquirer");

const department = require('./lib/department')
const role = require('./lib/role')
const employee = require('./lib/employee')


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
                    'Update an Employee Role',
                    'Exit'
                ]
            }
        ])

    if (choice.action === 'View All Departments') {
        await department.viewAll();
        init();
    }

    if (choice.action === 'View All Roles') { 
        await role.viewAll();
        init();
     }

    if (choice.action === 'View All Employees') { 
        await employee.viewAll();
        init();
     }

    if (choice.action === 'Add a Department') {
        await department.addNew();
        // await department.viewAll();
        init();
    }

    if (choice.action === 'Add a Role') { 
        await role.addNew();
        // await role.viewAll();
        init();
     }

    if (choice.action === 'Add an Employee') { 
        await employee.addNew();
        // await employee.viewAll();
        init();
     }

    if (choice.action === 'Update an Employee Role') { 
        await employee.updateRole();
        // await employee.viewAll();
        init(); }

    if (choice.action === 'Exit') { 
        return console.log("Logged Out") 
    }
}


init();