function reportAgeDistribution(ages) {
  const groups = {
    '<20': 0,
    '20-40': 0,
    '40-60': 0,
    '>60': 0,
  };

  for (const age of ages) {
    if (age < 20) groups['<20']++;
    else if (age <= 40) groups['20-40']++;
    else if (age <= 60) groups['40-60']++;
    else groups['>60']++;
  }

  const total = ages.length;
  console.log('\n Age-Group % Distribution');
  for (const [range, count] of Object.entries(groups)) {
    const percent = ((count / total) * 100).toFixed(2);
    console.log(`${range.padEnd(7)}: ${percent}%`);
  }
}

module.exports = { reportAgeDistribution };

