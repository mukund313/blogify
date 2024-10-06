const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const  userRoute  = require('./routes/user');
const  blogRoute  = require('./routes/blog');

const Blog = require('./models/blog');

const cookieParser = require('cookie-parser');
const { cheakForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/blogify').then((e) => console.log("MongoDb Connnected"));

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(cheakForAuthenticationCookie());
app.use(express.static(path.resolve('./public')));

app.use("/user", userRoute);
app.use("/blog", blogRoute);


app.get("/", async (req, res)=> {

    const allBlogs = await Blog.find({});

    return res.render("home", {
        user: req.user,
        blogs: allBlogs
    });
});






app.listen(PORT, ()=> console.log(`Server Started at PORT: ${PORT}`))