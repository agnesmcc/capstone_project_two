INSERT INTO categories (title)
VALUES
('toys'),
('furniture'),
('books'),
('electronics'),
('jewelery'),
('men''s clothing'),
('women''s clothing');

INSERT INTO users (username, first_name, last_name, email, password)
VALUES -- Passwords are all "123456"
('johnDoe', 'John', 'Doe', 'john@example.com', '$2b$10$kQ7V4DGAqaydxw9VzbLd5eHntHB9vSzpvTmbbAa/s2/swa9Pl8juy'),
('janeDoe', 'Jane', 'Doe', 'jane@example.com', '$2b$10$kQ7V4DGAqaydxw9VzbLd5eHntHB9vSzpvTmbbAa/s2/swa9Pl8juy'),
('bobSmith', 'Bob', 'Smith', 'bob@example.com', '$2b$10$kQ7V4DGAqaydxw9VzbLd5eHntHB9vSzpvTmbbAa/s2/swa9Pl8juy');
