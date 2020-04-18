// Temporary Secondary connection for portfolio
const mongoose = require('mongoose');

const conn = mongoose.createConnection(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
conn.model('User', require('./models/Portfolio/portfolio-users'));

module.exports = conn;