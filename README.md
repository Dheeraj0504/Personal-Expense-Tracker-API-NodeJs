# Personal Expense Tracker API

This is a RESTful API for managing personal financial records. Users can record their income and expenses, retrieve past transactions, and get summaries by category or time period.

## Technologies Used

- **Backend Framework**: Node.js with Express.js
- **Database**: SQLite

## Features

- Add, retrieve, update, and delete transactions.
- Retrieve a summary of transactions including total income, total expenses, and balance.
- Filter summaries by date range or category.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [SQLite](https://www.sqlite.org/index.html)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/personal-expense-tracker.git
   cd personal-expense-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - Make sure you have a SQLite database named `expenseTracker.db` in the project directory.
   - You can create the database and necessary tables by running the following SQL commands in a SQLite environment:

   ```sql
   CREATE TABLE categories (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL,
       type TEXT NOT NULL
   );

   CREATE TABLE transactions (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       type TEXT NOT NULL,
       category TEXT NOT NULL,
       amount REAL NOT NULL,
       date TEXT NOT NULL,
       description TEXT
   );
   ```

4. Insert initial data (optional):

   You can insert example data into the `transactions` and `categories` tables using the following SQL commands:

   ```sql
   INSERT INTO categories (name, type) VALUES
   ('Salary', 'income'),
   ('Freelance', 'income'),
   ('Groceries', 'expense'),
   ('Rent', 'expense'),
   ('Utilities', 'expense'),
   ('Entertainment', 'expense');

   INSERT INTO transactions (type, category, amount, date, description) VALUES
   ('income', 'Salary', 3000, '2024-10-01', 'Monthly salary'),
   ('income', 'Freelance', 800, '2024-10-05', 'Freelance project payment'),
   ('expense', 'Groceries', 150, '2024-10-10', 'Weekly grocery shopping'),
   ('expense', 'Rent', 1200, '2024-10-01', 'Monthly rent payment'),
   ('expense', 'Utilities', 200, '2024-10-15', 'Electricity and water bill'),
   ('expense', 'Entertainment', 100, '2024-10-20', 'Movie tickets');
   ```

5. Start the server:

   ```bash
   node index.js
   ```

   The server will run at [http://localhost:3000/](http://localhost:3000/).

## API Documentation

### Base URL

```
http://localhost:3000
```

### Endpoints

#### 1. Root Route

- **GET** `/`
  
  Response:
  ```json
  "Personal Expense Tracker API"
  ```

#### 2. Transactions

- **GET** `/transactions`

  Retrieves all transactions.

  Response:
  ```json
  [
      {
          "id": 1,
          "type": "income",
          "category": "Salary",
          "amount": 3000,
          "date": "2024-10-01",
          "description": "Monthly salary"
      },
      ...
  ]
  ```

- **GET** `/transactions/:id`

  Retrieves a transaction by ID.

  Response:
  ```json
  {
      "id": 1,
      "type": "income",
      "category": "Salary",
      "amount": 3000,
      "date": "2024-10-01",
      "description": "Monthly salary"
  }
  ```

- **POST** `/transactions`

  Adds a new transaction.

  Request Body:
  ```json
  {
      "type": "income",
      "category": "Freelance",
      "amount": 800,
      "date": "2024-10-05",
      "description": "Freelance project payment"
  }
  ```

  Response:
  ```json
  {
      "transactionId": 2
  }
  ```

- **PUT** `/transactions/:id`

  Updates a transaction by ID.

  Request Body:
  ```json
  {
      "type": "expense",
      "category": "Entertainment",
      "amount": 150,
      "date": "2024-10-21",
      "description": "Dinner out"
  }
  ```

  Response:
  ````
  "Transaction Updated Successfully"
  ````

- **DELETE** `/transactions/:id`

  Deletes a transaction by ID.

  Response:
  ````
  "Transaction deleted successfully"
  ````

#### 3. Summary

- **GET** `/summary`

  Retrieves a summary of transactions.

  Query Parameters:
  - `startDate`: (optional) Start date for filtering (format: YYYY-MM-DD)
  - `endDate`: (optional) End date for filtering (format: YYYY-MM-DD)
  - `category`: (optional) Category for filtering

  Response:
  ```json
  {
      "totalIncome": 3800,
      "totalExpenses": 450,
      "balance": 3350
  }
  ```

## Postman Collection

You can find a Postman collection with example requests in the `Postman_Collection.json` file (if provided).

## License

This project is licensed under the MIT License.
