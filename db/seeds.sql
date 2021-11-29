USE company_db;

INSERT INTO departments(id, name)
VALUES 
  (1, "Sales"),
  (2, "Engineering"),
  (3, "Finance"),
  (4, "Legal");
       

INSERT INTO roles(id, title, salary, department_id)
VALUES 
  (1, "Sales Team Lead", 180000, 1),
  (2, "Salesperson", 80000, 1),
  (3, "Lead Engineer", 150000, 2),
  (4, "Software Engineer", 120000, 2),
  (5, "Junior Engineer", 80000, 2),
  (6, "Finance Team Lead", 180000, 3),
  (7, "Accounts Manager", 90000, 3),
  (8, "Payroll Officer", 70000, 3),
  (9, "Legal Team Lead", 250000, 4),
  (10, "Lawyer", 150000, 4),
  (11, "Paralegal", 75000, 4);


INSERT INTO employees(id, first_name, last_name, role_id, manager_id)
VALUES 
  (1, "Gavin", "Cruz", 1, null),
  (2, "Alonzo", "Bauer", 3, null),
  (3, "Haley", "Evans", 6, null),
  (4, "Elsa", "Bray", 9, null),
  (5, "James", "Atkinson", 2, 1),
  (6, "Maxine", "Joyner", 8, 3),
  (7, "Eliott", "Dumas", 7, 3),
  (8, "Buck", "Abney", 4, 2),
  (9, "Anette", "Moul", 10, 4),
  (10, "James", "Woodcock", 5, 2);