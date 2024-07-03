# CSV to JSON Converter API

### This is a Node.js application that converts CSV files to JSON objects, uploads the data into a PostgreSQL database, and calculates age distribution statistics.

## Features

- Parses CSV files and converts each row to a JSON object.
- Stores the data in a PostgreSQL database.
- Combines firstName and lastName fields into a single name field.
- Combines address fields (line1, city, state) into a single address field.
- Stores additional information (e.g., gender) in the additional_info field.
- Calculates and displays age distribution statistics.

## Prerequisites

- npm
- PostgresSQL
- `npm` or `yarn`

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   CSV_FILE_PATH=./data/users.csv
   DB_HOST=localhost
   DB_USER=yourusername
   DB_PASSWORD=yourpassword
   DB_NAME=yourdbname
   DB_PORT=5432
   ```

## Database Setup

1. Create the `users` table in your PostgreSQL database:
   ```sql
   CREATE TABLE public.users (
    name VARCHAR NOT NULL,
    age INT4 NOT NULL,
    address JSONB NULL,
    additional_info JSONB NULL,
    id SERIAL4 NOT NULL PRIMARY KEY
   );
   ```

## Running the Application

1. Start the server:
   ```sh
   npm start / npm run dev
   ```
   The server will run on `http://localhost:3000`.
2. Upload the CSV file data to database:
   ```sh
   curl -X POST http://localhost:3000/upload
   ```
   Alternatively, you can use Postman or any other API client to send a POST request to 
   `http://localhost:3000/upload`.
3. Check the console for the age distribution table.

## Code Structure

- app.js: Main application file. Contains the Express server setup, database connection, and 
  route handlers.
- .env: Environment variables configuration file
- data/users.csv: Example CSV file path.



