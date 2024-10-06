const JWT =  require('jsonwebtoken');


const secret = "secret...";

function createTokenForUser(user){
    const paylaod ={
        _id: user._id,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
    };

    const token = JWT.sign(paylaod, secret);
    return token;
}

function validateToken(token){
    const paylaod = JWT.verify(token, secret);
    return paylaod;
}

module.exports = {
    createTokenForUser,
    validateToken
};