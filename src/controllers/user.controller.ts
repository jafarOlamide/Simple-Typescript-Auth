import { Request, Response } from "express";
import { createUserInput, verifyUserInput } from "../schema/user.schema";
import { createUser, findUserById } from "../services/user.service";
import sendEmail from "../utils/mailer";

export async function createUserHandler(req:Request<{}, {}, createUserInput> , res: Response) {
   const body = req.body;  

    try {
       const user = await createUser(body);

       await sendEmail({
           from: 'test@email.com',
           to: user.email,
           subject: 'Please verify your account',
           text: `Verfication Code ${user.verificationCode}. ID: ${user.id}`,

       });

       return res.send(["User created successfully", user]);
    } catch (error: any) {
       if (error.code === 11000) {
           return res.status(409).send("Account exists already");
       }
       return res.status(500).send(error);
   }    
} 


export async function verifyUserHandler(req:Request<verifyUserInput>, res: Response) {
    const id = req.params.id;
    const verificationCode = req.params.verificationCode;

    //Find User By ID
    const user = await findUserById(id);

    if (!user) {
        return res.send('User not found');
    }

    //Check if user is verified 
    if (user.verified) {
        return res.send('User already verified');
    }

    //confirm verification code are equal 
    if (user.verificationCode === verificationCode) {
        user.verified = true;

        user.save();

        return res.send("User verified successfully");
    }

    res.send('Could not verify user');
}