const { Router } = require("express");
const Blog = require('../models/blog');

const multer = require('multer');
const path = require('path');
const Comment = require("../models/comment");


const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {

        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});
const upload = multer({ storage: storage });

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user,
    })
});

router.post('/', upload.single('coverImage'), async (req, res) => {

    const { title, body } = req.body;

    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    });
    return res.redirect(`/blog/${blog._id}`);
});

router.post('/comment/:blogId', async (req, res) => {
    await Comment.create({

        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    });
    return res.redirect(`/blog/${req.params.blogId}`)
})


// router.get('/:id', async (req, res) => {
//     const blog = await Blog.findById(req.params._id).populate('createdBy');
//     const comments = await Comment.findById(req.params.id).populate("createdBy");
//     console.log('comment: ', comments)
//     return res.render("blog", {
//         user: req.user,
//         blog,
//         comments
//     });
// });


router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy');
        
        // Fetch the comments related to the blog
        const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');

        return res.render("blog", {
            user: req.user,
            blog,
            comments // Now this is an array of comments
        });
    } catch (error) {
        console.error("Error fetching blog or comments:", error);
        res.status(500).send("Something went wrong.");
    }
});



module.exports = router;