const express = require('express');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.get('*', (_req, res) => {
  res.send({ msg: 'Backend service is running.' });
});

app.listen(port, () => {
  console.log(`Backend service listening on port ${port}`);
});