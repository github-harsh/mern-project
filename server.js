const express = require('express');
const connectDb = require('./config/db')

const app = express();

// Connect database
connectDb();

// Middleware
app.use(express.json({extended: false})) // This will allow us to get data in req.body

// A simple get request to check whether the API is working.
app.get('/', 
        (req, res) => res.send('API Running'));


// Define routes
app.use('/api/users',   require('./routes/api/users'));
app.use('/api/auth',    require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts',   require('./routes/api/posts'))

// This will look for an environment variable called PORT in Heroku. If no env var is found it will use 5000
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));