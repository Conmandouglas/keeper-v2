CREATE DATABASE keeper;

CREATE TABLE items(
  item_id SERIAL PRIMARY KEY,
  item_title VARCHAR(50),
  description VARCHAR(255)
);