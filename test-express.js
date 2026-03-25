const express = require('express');
const { execSync } = require('child_process');
const app = express();
app.use(express.json());
app.post('/', (req, res) => {
  console.log('Got body:', req.body);
  res.json({ success: true, body: req.body });
});
const server = app.listen(5001, () => {
  console.log('Test server ready');
  try {
    const out = execSync(`curl.exe -X POST http://localhost:5001/ -H "Content-Type: application/json" -d "{\\"name\\":\\"test\\"}"`);
    console.log('cURL result:', out.toString());
  } catch (e) {
    console.error('cURL failed');
  }
  server.close();
});
