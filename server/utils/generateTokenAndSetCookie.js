import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '3d'})

    res.cookie('jwtoken', token, {
        httpOnly: true, //cookie cannot be accessed by the client side js
        secure: process.env.NODE_ENV === 'production', 
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return token;
}