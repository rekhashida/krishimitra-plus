const fs = require('fs');
const path = 'src/data/india-states-districts.json';

const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const gujarat = data.find(s => s.state === 'Gujarat');
const missing = ['Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'];

missing.forEach(d => {
  if (!gujarat.districts.includes(d)) {
    gujarat.districts.push(d);
  }
});

gujarat.districts.sort();

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('✅ Gujarat now has', gujarat.districts.length, 'districts');