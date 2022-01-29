const inquirer = require("inquirer");
const mysql = require("mysql2");
const ctable = require("console.table");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sghosh17",
  database: "employee_tracker",
});

con.connect(function (err) {
  if (err) throw err;
  database_search();
});

function database_search() {
  inquirer
    .prompt([
      {
        type: "rawlist",
        message: "What would you like to do?",
        name: "action",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then(function (response) {
      switch (response.action) {
        case "View all departments":
          view_departments();
          break;

        case "View all roles":
          view_roles();
          break;

        case "View all employees":
          view_employee();
          break;

        case "Add a department":
          add_department();
          break;

        case "Add a role":
          add_role();
          break;

        case "Add an employee":
          add_employee();

        case "Update an employee role":
          update_emp_roll();
      }
    });
}

function view_departments() {
  var query = "Select * from department";
  con.query(query, function (err, res) {
    if (err) throw err;
    else console.table("\n", res);
    database_search();
  });
  console.log("DEPARTMENTS");
}

function view_roles() {
  var query = "Select * from role";
  con.query(query, function (err, res) {
    if (err) throw err;
    else console.table("\n", res);
    database_search();
  });
}

function view_employee() {
  var query = "Select * from employee";
  con.query(query, function (err, res) {
    if (err) throw err;
    else console.table("\n", res);
    database_search();
  });
}

function add_department() {
  inquirer;
  prompt([
    {
      type: "Input",
      name: "dept",
      message: "Please enter department name:",
    },
  ]).then(function (answer) {
    var query = "insert into department values";
    con.query(query, function (err, res) {
      if (err) throw err;
      else console.table("\n", res);
      database_search();
    });
  });
}
