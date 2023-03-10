const express =  require('express');
const mongoose = require('mongoose');
const rateRouter = require('./routes/rating');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const dotenv = require('dotenv');
const { default: rate_router } = require('./routes/rating');
dotenv.config();
const path = require("path");
const cors = require('cors');
const multer = require("multer");
const http = require('http');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
 }).then(
    console.log('connect to mongodb')
).catch((err) => console.log(err))


const app =  express();

app.use(cors());
app.use(express.json());
app.use("/images" , express.static(path.join(__dirname, "/images")));
app.get("/image.png", (req, res) => {
    res.sendFile(path.join(__dirname, "./uploads/image.png"));
  });

const storage =  multer.diskStorage({
    destination: (req, file,cb) => {
        cb(null, "images")
    },
    filename: (req, file,cb) => {
        cb(null, file.originalname)
    }
});
const upload =  multer({storage: storage});
app.post("/api/upload", upload.single("file"), (req,res) => {
    res.status(200).json("File has been upload")
})

app.get('/api', (req, res) => {
    res.send('hello world');
});
app.use('/api/rating',rateRouter);
app.use('/api/auth', authRouter);
app.get('/api/images/:name', (req,res) => {
    const imagesName =  req.params.name;
    res.sendFile(path.join(__dirname, `./images/${imagesName}`));

})

app.use('/api/users',usersRouter);
app.get('/', (req, res) => {
    res.send('hello world');
});
const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(port, ()=> {
    console.log(`Server running on port ${port}`)
})