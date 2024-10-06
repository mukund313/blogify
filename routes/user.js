const { Router } = require("express");
const User = require("../models/user")
const router = Router();


router.get('/signin', (req, res) => {
    return res.render("signin");
});


router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const token = await User.matchPasswordAndGenerateToken(email, password);

        console.log("token: ", token);

        res.cookie("token", token);
        return res.redirect("/");
    } catch (error) {

        return res.render(
            'signin', {
            error: "Incorrect Email or Password",
        });

    }

 

});


router.get('/signup', (req, res) => {
    return res.render("signup");

});



router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({ fullName, email, password });

    return res.redirect("/user/signin");

});

router.get('/logout', (req, res)=>{
    
    return res.clearCookie('token').redirect('/');
    });

module.exports = router;