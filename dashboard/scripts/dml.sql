INSERT INTO users (id, name, email, password) VALUES ('410544b2-4001-4271-9855-fec4b6a6442a', 'User', 'user@nextmail.com', '123456');
INSERT INTO customers (id, name, email, image_url) VALUES ('3958dc9e-712f-4377-85e9-fec4b6a6442a', 'Delba de Oliveira', 'delba@oliveira.com', '/customers/delba-de-oliveira.png');
INSERT INTO customers (id, name, email, image_url) VALUES ('3958dc9e-742f-4377-85e9-fec4b6a6442a', 'Lee Robinson', 'lee@robinson.com', '/customers/lee-robinson.png');
INSERT INTO customers (id, name, email, image_url) VALUES ('3958dc9e-737f-4377-85e9-fec4b6a6442a', 'Hector Simpson', 'hector@simpson.com', '/customers/hector-simpson.png');
INSERT INTO customers (id, name, email, image_url) VALUES ('50ca3e18-62cd-11ee-8c99-0242ac120002', 'Steven Tey', 'steven@tey.com', '/customers/steven-tey.png');
INSERT INTO customers (id, name, email, image_url) VALUES ('3958dc9e-787f-4377-85e9-fec4b6a6442a', 'Steph Dietz', 'steph@dietz.com', '/customers/steph-dietz.png');
INSERT INTO customers (id, name, email, image_url) VALUES ('76d65c26-f784-44a2-ac19-586678f7c2f2', 'Michael Novotny', 'michael@novotny.com', '/customers/michael-novotny.png');
INSERT INTO customers (id, name, email, image_url) VALUES ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 'Evil Rabbit', 'evil@rabbit.com', '/customers/evil-rabbit.png');
INSERT INTO customers (id, name, email, image_url) VALUES ('126eed9c-c90c-4ef6-a4a8-fcf7408d3c66', 'Emil Kowalski', 'emil@kowalski.com', '/customers/emil-kowalski.png');
INSERT INTO customers (id, name, email, image_url) VALUES ('CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 'Amy Burns', 'amy@burns.com', '/customers/amy-burns.png');
INSERT INTO customers (id, name, email, image_url) VALUES ('13D07535-C59E-4157-A011-F8D2EF4E0CBB', 'Balazs Orban', 'balazs@orban.com', '/customers/balazs-orban.png');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('3958dc9e-712f-4377-85e9-fec4b6a6442a1', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 15795, 'pending', '2022-12-06');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('3958dc9e-742f-4377-85e9-fec4b6a6442a2', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 20348, 'pending', '2022-11-14');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('3958dc9e-787f-4377-85e9-fec4b6a6442a3', '3958dc9e-787f-4377-85e9-fec4b6a6442a', 3040, 'paid', '2022-10-29');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('50ca3e18-62cd-11ee-8c99-0242ac1200024', '50ca3e18-62cd-11ee-8c99-0242ac120002', 44800, 'paid', '2023-09-10');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('76d65c26-f784-44a2-ac19-586678f7c2f25', '76d65c26-f784-44a2-ac19-586678f7c2f2', 34577, 'pending', '2023-08-05');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('126eed9c-c90c-4ef6-a4a8-fcf7408d3c666', '126eed9c-c90c-4ef6-a4a8-fcf7408d3c66', 54246, 'pending', '2023-07-16');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa7', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 666, 'pending', '2023-06-27');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('50ca3e18-62cd-11ee-8c99-0242ac1200028', '50ca3e18-62cd-11ee-8c99-0242ac120002', 32545, 'paid', '2023-06-09');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('3958dc9e-787f-4377-85e9-fec4b6a6442a9', '3958dc9e-787f-4377-85e9-fec4b6a6442a', 1250, 'paid', '2023-06-17');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('76d65c26-f784-44a2-ac19-586678f7c2f210', '76d65c26-f784-44a2-ac19-586678f7c2f2', 8546, 'paid', '2023-06-07');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('3958dc9e-742f-4377-85e9-fec4b6a6442a11', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 500, 'paid', '2023-08-19');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('76d65c26-f784-44a2-ac19-586678f7c2f212', '76d65c26-f784-44a2-ac19-586678f7c2f2', 8945, 'paid', '2023-06-03');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('3958dc9e-737f-4377-85e9-fec4b6a6442a13', '3958dc9e-737f-4377-85e9-fec4b6a6442a', 8945, 'paid', '2023-06-18');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('3958dc9e-712f-4377-85e9-fec4b6a6442a14', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 8945, 'paid', '2023-10-04');
INSERT INTO invoices(id, customer_id, amount, status, date) VALUES ('3958dc9e-737f-4377-85e9-fec4b6a6442a15', '3958dc9e-737f-4377-85e9-fec4b6a6442a', 1000, 'paid', '2022-06-05');
INSERT INTO revenue (month, revenue) VALUES ('Jan', 2000);
INSERT INTO revenue (month, revenue) VALUES ('Feb', 1800);
INSERT INTO revenue (month, revenue) VALUES ('Mar', 2200);
INSERT INTO revenue (month, revenue) VALUES ('Apr', 2500);
INSERT INTO revenue (month, revenue) VALUES ('May', 2300);
INSERT INTO revenue (month, revenue) VALUES ('Jun', 3200);
INSERT INTO revenue (month, revenue) VALUES ('Jul', 3500);
INSERT INTO revenue (month, revenue) VALUES ('Aug', 3700);
INSERT INTO revenue (month, revenue) VALUES ('Sep', 2500);
INSERT INTO revenue (month, revenue) VALUES ('Oct', 2800);
INSERT INTO revenue (month, revenue) VALUES ('Nov', 3000);
INSERT INTO revenue (month, revenue) VALUES ('Dec', 4800);
