const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'large_users.csv');
const file = fs.createWriteStream(filePath);

file.write('name.firstName,name.lastName,age,address.line1,address.city,address.state,gender\n');

for (let i = 0; i < 10000; i++) {
  const firstName = `User${i}`;
  const lastName = `Test${i}`;
  const age = Math.floor(Math.random() * 70) + 10; // age between 10 and 80
  const line1 = `Address-${i}`;
  const city = `City${i % 100}`; // repeat city names
  const state = `State${i % 50}`;
  const gender = i % 2 === 0 ? 'male' : 'female';

  file.write(`${firstName},${lastName},${age},${line1},${city},${state},${gender}\n`);
}

file.end(() => {
  console.log(' 10,000-record CSV file generated at:', filePath);
});
