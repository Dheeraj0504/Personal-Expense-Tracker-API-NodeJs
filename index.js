const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "expenseTracker.db");
let database = null;

const initializeDBAndServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB ERROR: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Root route
app.get("/", (request, response) => {
  response.send("Personal Expense Tracker API");
});

// Retrieves all transactions.
app.get("/transactions", async (request, response) => {
  try {
    const getTransactionsData = `
        SELECT * 
        FROM transactions;
    `;
    const transactionsData = await database.all(getTransactionsData);
    response.json(transactionsData);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Retrieves a transaction by ID.
app.get("/transactions/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const getTransaction = `
        SELECT * 
        FROM transactions
        WHERE id = ?;
    `;
    const transactionData = await database.get(getTransaction, [id]);
    if (!transactionData) {
      return response.status(404).json({ error: "Transaction not found" });
    }
    response.json(transactionData);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Adds a new transaction (income or expense).
app.post("/transactions", async (request, response) => {
  const transactionsDetails = request.body;
  const { type, category, amount, date, description } = transactionsDetails;

  // Basic validation
  if (!type || !category || !amount || !date) {
    return response.status(400).json({ error: "Missing required fields" });
  }

  try {
    const addTransaction = `
        INSERT INTO transactions (type, category, amount, date, description)
        VALUES (?, ?, ?, ?, ?);
    `;
    const addTransactionResponse = await database.run(addTransaction, [
      type,
      category,
      amount,
      date,
      description,
    ]);
    const transactionId = addTransactionResponse.lastID;
    response.status(201).json({ transactionId });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Updates a transaction by ID.
app.put("/transactions/:id", async (request, response) => {
  const { id } = request.params;
  const transactionDetails = request.body;
  const { type, category, amount, date, description } = transactionDetails;

  // Basic validation
  if (!type || !category || !amount || !date) {
    return response.status(400).json({ error: "Missing required fields" });
  }

  try {
    const updateTransactionQuery = `
        UPDATE transactions 
        SET 
            type = ?,
            category = ?,
            amount = ?,
            date = ?,
            description = ?
        WHERE id = ?;
    `;
    const updateResponse = await database.run(updateTransactionQuery, [
      type,
      category,
      amount,
      date,
      description,
      id,
    ]);

    if (updateResponse.changes === 0) {
      return response.status(404).json({ error: "Transaction not found" });
    }

    response.json({ message: "Transaction updated successfully" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Delete a transaction by ID
app.delete("/transactions/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const deleteTransactionQuery = `
        DELETE FROM transactions 
        WHERE id = ?;
    `;
    const deleteResponse = await database.run(deleteTransactionQuery, [id]);

    if (deleteResponse.changes === 0) {
      return response.status(404).json({ error: "Transaction not found" });
    }

    response.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Summary endpoint
app.get("/summary", async (request, response) => {
  const { startDate, endDate, category } = request.query;

  let query = `
        SELECT 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpenses
        FROM transactions
    `;

  const params = [];

  // Adding conditions for date range and category
  if (startDate || endDate || category) {
    query += " WHERE";

    if (startDate) {
      query += " date >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += (params.length ? " AND" : "") + " date <= ?";
      params.push(endDate);
    }

    if (category) {
      query += (params.length ? " AND" : "") + " category = ?";
      params.push(category);
    }
  }

  try {
    const row = await database.get(query, params);
    const totalIncome = row.totalIncome || 0;
    const totalExpenses = row.totalExpenses || 0;
    const balance = totalIncome - totalExpenses;

    response.json({
      totalIncome,
      totalExpenses,
      balance,
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});
