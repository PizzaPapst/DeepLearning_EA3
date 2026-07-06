const fs = require('fs');
let data = fs.readFileSync('public/model/model.json', 'utf8');
data = data.replace(/"batch_shape"/g, '"batchInputShape"');
fs.writeFileSync('public/model/model.json', data);
console.log('Fixed model.json');
