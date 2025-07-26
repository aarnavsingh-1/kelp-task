const fs = require('fs');
const readline = require('readline');

function buildNestedObject(obj, keys, value) {
  let current = obj;
  keys.forEach((key, idx) => {
    if (idx === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  });
}

async function* parseCSVStream(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let headers = [];

  for await (const line of rl) {
    const values = line.split(',').map(v => v.trim());

    if (headers.length === 0) {
      headers = values;
      continue;
    }

    const user = {};
    const additional = {};

    headers.forEach((header, idx) => {
      const keys = header.split('.');
      const value = values[idx];

      if (header === 'name.firstName') user.firstName = value;
      else if (header === 'name.lastName') user.lastName = value;
      else if (header === 'age') user.age = parseInt(value, 10);
      else buildNestedObject(additional, keys, value);
    });

    const address = additional.address || null;
    if (address) delete additional.address;

    yield {
      name: `${user.firstName} ${user.lastName}`,
      age: user.age,
      address,
      additional_info: additional
    };
  }
}

module.exports = { parseCSVStream };

