const express = require('express');

const app = express();

// A simple get request to check whether the API is working.
app.get('/', 
        (req, res) => res.send('API Running'));

// This will look for an environment variable called PORT in Heroku. If no env var is found it will use 5000
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));