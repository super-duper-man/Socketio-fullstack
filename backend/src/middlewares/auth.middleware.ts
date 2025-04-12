import { NextFunction, Request, Response } from 'express';

// Extend the Request interface to include the 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export const protectRoute = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if(!token)
            res.status(401).json({message: "Unauthorized - No Token Provided"});

        const decoded = jwt.verify(token, String(process.env.JWT_SECRET));

        if(!decoded)
            res.status(401).json({message: "Unauthorized - Invalid Token"});

        if (typeof decoded === 'object' && 'userId' in decoded) {
            const user = await User.findById(String(decoded['userId'])).select("-password");

            if(!user)
                res.status(404).json({message: 'User not found'})

            req.user = user;

            next();
        } else {
            res.status(401).json({ message: "Unauthorized - Invalid Token Payload" });
        }
    } catch (error: any) {
        console.log(`Error in protectRoute middleware`, error.message);
        res.status(500).json({message: `Internal server error`});
    }
}