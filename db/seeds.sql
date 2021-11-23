USE company_db;

INSERT INTO departments(name)
VALUES ("Sales"),
  ("Engineering"),
  ("Finance"),
  ("Legal");
       
INSERT INTO roles(title, salary, department_id)
VALUES ("Salesperson", 80000, 1),
  ("Lead Engineer", 150000, 2),
  ("Software Engineer", 120000, 2),
  ("Lawyer", 150000, 2),
  ("Sales Team Lead", 180000, 4),
  ("Legal Team Lead", 250000, 4);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES ("Gavin", "Cruz", 5, null),
  ("Alonzo", "Bauer", 2, null),
  ("Haley", "Evans", 6, null),
  ("Elsa", "Bray", 4, 3),
  ("James", "Atkinson", 1, 1);