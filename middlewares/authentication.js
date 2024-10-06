const { validateToken } = require("../services/authentication");

function cheakForAuthenticationCookie() {
    return (req, res, next) =>{

        const tokenCookieValue = req.cookies?.token;

        if (!tokenCookieValue) {
           return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (e) {}

        return next();
    };


}

module.exports = {
    cheakForAuthenticationCookie
}