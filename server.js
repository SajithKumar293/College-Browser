const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();

require('dotenv').config({
    path: './config/config.env'
});
const PORT = process.env.PORT || 8080;

const routes = require('./routes/api')

mongoose.connection.on('open',() => {
    console.log('Connected to mongodb:', mongoose.connection.host);
})
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true , useUnifiedTopology: true,useCreateIndex:true});

app.use(bodyparser.json());
app.use(cors());
app.use(cors({
    origin: process.env.CLIENT_URL 
}))
//HTTP request logger
app.use(morgan('dev'));
app.use('/api',routes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req,res)=> {
        res.sendFile(path.join(__dirname,'client','build','index.html'));
    });
}

app.listen(process.env.PORT || 5000)
