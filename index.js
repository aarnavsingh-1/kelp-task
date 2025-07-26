const express = require('express');
const dotenv = require('dotenv');
const pool = require('./config/db');
const { parseCSVStream } = require('./utils/csvStreamParser');
const { reportAgeDistribution } = require('./utils/reporter');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const BATCH_SIZE = 1000;

app.get('/upload', async (req, res) => {
  try {
    const client = await pool.connect();
    const ages = [];
    const batch = [];

    await client.query('BEGIN');

    //  Clear all existing records from previous 
    await client.query('DELETE FROM users');

    //optimizing :  Read and batch insert 
    for await (const user of parseCSVStream(process.env.CSV_FILE_PATH)) {
      batch.push(user);
      ages.push(user.age);

      if (batch.length === BATCH_SIZE) {
        await insertBatch(client, batch);
        batch.length = 0;
      }
    }

    if (batch.length > 0) {
      await insertBatch(client, batch);
    }

    await client.query('COMMIT');
    client.release();

    reportAgeDistribution(ages);
    res.send(' Previous records cleared. CSV uploaded and report generated.');
  } catch (err) {
    console.error(' Error:', err);
    res.status(500).send('Error processing CSV');
  }
});

async function insertBatch(client, batch) {
  const query = `
    INSERT INTO users (name, age, address, additional_info)
    VALUES ${batch.map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(',')}
  `;

  const values = batch.flatMap(user => [
    user.name,
    user.age,
    user.address,
    user.additional_info
  ]);

  await client.query(query, values);
}

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

