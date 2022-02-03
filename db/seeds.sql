-- Inserting values to the department table --
INSERT INTO department ( dept_name)
VALUES ("Engineer"),
       ("Finance"),
       ("Legal"),
       ("Sales");   

-- Inserting values to the role table --
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead",100000,4),
       ("Salesperson",80000,4),
       ("Lead Engineer",15000,1),
       ("Software Engineer",120000,1),
       ("Account Manager",160000,2),
       ("Accountant",125000,2),
       ("Legal Team Lead",250000,3),
       ("Lawyer",190000,3);    

-- Inserting values to the employee table --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jhon","Doe",1,0),
       ("Mike","Chan",2,1),
       ("Ashley","Rodriguez",3,0),
       ("Kevin","Tupik",4,3),
       ("Kunal","Singh",5,0),
       ("Malia","Brown",6,5),
       ("Sarah","Lourd",7,0),
       ("Tom","Allen",8,7);        