const express =  require('express');
const mongoose = require('mongoose');
const rateRouter = require('./routes/rating');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth')
const dotenv = require('dotenv');
const { default: rate_router } = require('./routes/rating');
dotenv.config();
const path = require("path");
const cors = require('cors');


mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
 }).then(
    console.log('connect to mongo')
).catch((err) => console.log(err))


const app =  express();

app.use(cors());
app.use(express.json());
app.get('/api', (req, res) => {
    res.send('hello world');
});
app.use('/api/rating',rateRouter);
app.use('/api/auth', authRouter);

app.use('/api/users',usersRouter);


app.listen('5000', ()=> {
    console.log('Server is running...')
})