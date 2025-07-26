# Kelp-task
This is a streaming-based CSV-to-PostgreSQL ingestion pipeline. The API parses deeply nested fields from a large CSV file and inserts the structured data into PostgreSQL while printing an age-group distribution report to the console.

## Features

- Stream-based CSV parser (handles 50K+ records efficiently)
- Supports infinite nesting using dot notation (e.g., `a.b.c.d`)
- Converts flat CSV to structured nested JSON
- Deletes previous records before inserting new ones
- Batches database inserts for high performance
- Prints age group % distribution (<20, 20–40, 40–60, >60) to console
- Config-driven setup using `.env`

## ⚙Setup Instructions

### 1. Clone the Repository


git clone https://github.com/yourusername/kelp-task.git
cd kelp-task

### 2. Install Dependencies

npm init -y
npm install express pg dotenv

### 3. Create a .env File
PORT=3000
CSV_FILE_PATH=./data/users.csv
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/kelp_users

### 4. Setup a postgres table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  age INT,
  address JSONB,
  additional_info JSONB
);

### 5. Start server
node index.js

### 6. Upload the CSV
Open your browser or use Postman/cURL to trigger the upload:
GET http://localhost:3000/upload

## Assumptions
The first row of the CSV always contains dot-notated keys (e.g., name.firstName, address.line1)

The CSV will have consistent field ordering, with sub-properties grouped together (e.g., all address.* fields come one after another)

The number of rows can exceed 50,000, so file is streamed line-by-line

If the same nested field structure repeats (e.g., many address.* fields), we consider them part of the same object

Each /upload call deletes existing data — only for demo purposes. For every new csv a new object and table is made with new entries.All previous records are deleted.






 


