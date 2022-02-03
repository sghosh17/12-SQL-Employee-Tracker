const inquirer = require("inquirer");
const mysql = require("mysql2");
const ctable = require("console.table");

// Creates Database Connection
var con = mysql.createConnection({
  host: "localhost",
  user: "XXXXXXX", // Use your own user
  password: "XXXXXXXX", // Use your own password
  database: "employee_tracker",
});
// Start of application
con.connect(function (err) {
  if (err) throw err;
  database_search();
});
// Prompts list of options to the user
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
          "Update an employee Manager",
          "View by Manager",
          "View by Department",
          "View Departmental total budget",
          "Exit",
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
          break;

        case "Update an employee role":
          update_emp_role();
          break;

        case "Update an employee Manager":
          update_emp_manager();
          break;

        case "View by Manager":
          view_by_manager();
          break;

        case "View by Department":
          view_by_department();
          break;

        case "View Departmental total budget":
          group_by_department();
          break;
        default:
          process.exit();
      }
    });
}
// View all departments
function view_departments() {
  var query = "Select * from department";
  con.query(query, function (err, res) {
    if (err) throw err;
    else console.table("\n", res);
    database_search();
  });
}
// View all roles
function view_roles() {
  var query =
    "Select role.id, role.title, role.salary, department.dept_name from role, department where role.department_id=department.id";
  con.query(query, function (err, res) {
    if (err) throw err;
    else console.table("\n", res);
    database_search();
  });
}
// View all employees
function view_employee() {
  var query =
    "Select e.id, e.first_name, e.last_name, r.title, d.dept_name, concat(m.first_name,' ',m.last_name) as Manager from employee e left join employee m ON m.id = e.manager_id inner join role r ON e.role_id = r.id inner join department d ON r.department_id = d.id";
  con.query(query, function (err, res) {
    if (err) throw err;
    else console.table("\n", res);
    database_search();
  });
}
// Add a new department
function add_department() {
  inquirer
    .prompt([
      {
        type: "Input",
        name: "dept",
        message: "Please enter department name:",
      },
    ])
    .then(function (answer) {
      var query = `INSERT INTO department (dept_name)
    VALUES (?)`;
      con.query(query, [answer.dept], function (err, res) {
        if (err) throw err;
        else {
          var query = `SELECT * FROM department`;
          con.query(query, [answer.dept], function (err, res) {
            if (err) throw err;
            else console.table("\n", res);
            database_search();
          });
        }
      });
    });
}
// Add a new role
function add_role() {
  let dept;
  new Promise(function (resolve, reject) {
    con.query("Select dept_name, id from department", function (err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  })
    .then(function (result) {
      dept = result;
    })
    .then(function () {
      inquirer
        .prompt([
          {
            type: "list",
            name: "dept",
            message: "Select department for the role?", // One -to-many relationship
            choices: dept.map((row) => ({
              name: row.dept_name,
              value: row.id,
            })),
          },
          {
            type: "Input",
            name: "title",
            message: "Please enter the role name:",
          },
          {
            type: "Input",
            name: "salary",
            message: "Please enter salary of the role:",
          },
        ])
        .then(function (answer) {
          var query = `INSERT INTO role (title, salary, department_id)
        VALUES (?,?,?)`;
          con.query(
            query,
            [answer.title, answer.salary, answer.dept],
            function (err, res) {
              if (err) throw err;
              else {
                var query = `SELECT * FROM role`;
                con.query(query, [answer.dept], function (err, res) {
                  if (err) throw err;
                  else console.table("\n", res);
                  database_search();
                });
              }
            }
          );
        });
    });
}
// Add a new employer
function add_employee() {
  let role, manager;

  new Promise(function (resolve, reject) {
    con.query("Select title, id from role", function (err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  })
    .then(function (result) {
      role = result;

      return new Promise(function (resolve, reject) {
        con.query(
          "Select first_name, last_name, id from employee where manager_id=0",
          function (err, value) {
            if (err) {
              return reject(err);
            }
            resolve(value);
          }
        );
      });
    })
    .then(function (value) {
      manager = value;
    })
    .then(function () {
      inquirer
        .prompt([
          {
            type: "Input",
            name: "f_name",
            message: "Please enter the First Name:",
          },
          {
            type: "Input",
            name: "l_name",
            message: "Please enter the last name:",
          },
          {
            type: "list",
            name: "role_title",
            message: "Please enter the employee's role:",
            choices: role.map((row) => ({ name: row.title, value: row.id })),
          },
          {
            type: "list",
            name: "manager",
            message: "Please enter the Manager's name:",
            choices: manager.map((row) => ({
              name: row.first_name + " " + row.last_name,
              value: row.id,
            })),
          },
        ])
        .then(function (answer) {
          var query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
          VALUES (?,?,?,?)`;
          con.query(
            query,
            [answer.f_name, answer.l_name, answer.role_title, answer.manager],
            function (err, res) {
              if (err) throw err;
              else {
                var query = `SELECT * FROM employee`;
                con.query(query, [answer.dept], function (err, res) {
                  if (err) throw err;
                  else console.table("\n", res);
                  database_search();
                });
              }
            }
          );
        });
    });
}
// Update an employee role
function update_emp_role() {
  let emp, role;

  new Promise(function (resolve, reject) {
    con.query(
      "Select first_name, last_name, id from employee",
      function (err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result);
      }
    );
  })
    .then(function (result) {
      emp = result;

      return new Promise(function (resolve, reject) {
        con.query("Select title, id from role", function (err, value) {
          if (err) {
            return reject(err);
          }
          resolve(value);
        });
      });
    })
    .then(function (value) {
      role = value;
    })
    .then(function () {
      inquirer
        .prompt([
          {
            type: "list",
            name: "emp",
            message: "Which employee role you want to update?",
            choices: emp.map((row) => ({
              name: row.first_name + " " + row.last_name,
              value: row.id,
            })),
          },
          {
            type: "list",
            name: "role_title",
            message: "Which role you want to assign?",
            choices: role.map((row) => ({ name: row.title, value: row.id })),
          },
        ])
        .then(function (answer) {
          var query = `UPDATE employee SET role_id= ? WHERE id=?`;
          con.query(
            query,
            [answer.role_title, answer.emp],
            function (err, res) {
              if (err) throw err;
              else {
                var query = `SELECT * FROM employee`;
                con.query(query, [answer.dept], function (err, res) {
                  if (err) throw err;
                  else console.table("\n", res);
                  database_search();
                });
              }
            }
          );
        });
    });
}
// Update an employee manager
function update_emp_manager() {
  let emp, manager;

  new Promise(function (resolve, reject) {
    con.query(
      "Select first_name, last_name, id from employee",
      function (err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result);
      }
    );
  })
    .then(function (result) {
      emp = result;

      return new Promise(function (resolve, reject) {
        con.query(
          "Select first_name, last_name, id from employee where manager_id=0",
          function (err, value) {
            if (err) {
              return reject(err);
            }
            resolve(value);
          }
        );
      });
    })
    .then(function (value) {
      manager = value;
    })
    .then(function () {
      inquirer
        .prompt([
          {
            type: "list",
            name: "emp",
            message: "Which employee manager you want to update?",
            choices: emp.map((row) => ({
              name: row.first_name + " " + row.last_name,
              value: row.id,
            })),
          },
          {
            type: "list",
            name: "manager",
            message: "Which Manager you want to assign?",
            choices: manager.map((row) => ({
              name: row.first_name + " " + row.last_name,
              value: row.id,
            })),
          },
        ])
        .then(function (answer) {
          var query = `UPDATE employee SET manager_id= ? WHERE id=?`;
          con.query(query, [answer.manager, answer.emp], function (err, res) {
            if (err) throw err;
            else {
              var query = `SELECT * FROM employee`;
              con.query(query, [answer.dept], function (err, res) {
                if (err) throw err;
                else console.table("\n", res);
                database_search();
              });
            }
          });
        });
    });
}
// View by manager name
function view_by_manager() {
  let manager;

  new Promise(function (resolve, reject) {
    con.query(
      "Select first_name, last_name, id from employee where manager_id=0",
      function (err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result);
      }
    );
  })
    .then(function (result) {
      manager = result;
    })
    .then(function () {
      inquirer
        .prompt([
          {
            type: "list",
            name: "manager",
            message: "Which manager's team you want to display?",
            choices: manager.map((row) => ({
              name: row.first_name + " " + row.last_name,
              value: row.id,
            })),
          },
        ])
        .then(function (answer) {
          var query = `Select id,first_name, last_name from employee where manager_id=?`;
          con.query(query, [answer.manager], function (err, res) {
            if (err) throw err;
            else console.table("\n", res);
            database_search();
          });
        });
    });
}
// View by department name
function view_by_department() {
  let dept;

  new Promise(function (resolve, reject) {
    con.query("Select dept_name, id from department", function (err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  })
    .then(function (result) {
      dept = result;
    })
    .then(function () {
      inquirer
        .prompt([
          {
            type: "list",
            name: "dept",
            message: "Which department you want to display?",
            choices: dept.map((row) => ({
              name: row.dept_name,
              value: row.id,
            })),
          },
        ])
        .then(function (answer) {
          var query = `Select e.id, e.first_name, e.last_name, d.dept_name from employee e, role r, department d where e.role_id = r.id and r.department_id = d.id and d.id = ?`;
          con.query(query, [answer.dept], function (err, res) {
            if (err) throw err;
            //else console.table("\n", res);
            database_search();
          });
        });
    });
}
//View Departmental total budget
function group_by_department() {
  var query =
    "Select r.department_id as Dept_Code, d.dept_name as Dept_Name, SUM(r.salary) as Total_Budget from role r, department d where r.department_id=d.id GROUP BY r.department_id";
  con.query(query, function (err, res) {
    if (err) throw err;
    else console.table("\n", res);
    database_search();
  });
}
