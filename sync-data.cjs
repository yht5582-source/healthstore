const fs=require('node:fs');
const path=require('node:path');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'data.json'),'utf8'));
fs.writeFileSync(path.join(__dirname,'data.js'),'window.HEALTH_DATA = '+JSON.stringify(data)+';\n');
console.log('Synchronized data.js from data.json');
