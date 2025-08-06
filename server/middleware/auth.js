import { clerkClient } from "@clerk/express";


export const protectAdmin = async(res,req,next) =>{
    try {
        const { userid } = req.auth()

        const user = await clerkClient.users.getUser(userid)

        if(user.privateMetadata.role !== 'admin'){
            return res.json({success:false, message: "not authorized"})
        }
        next()
    } catch (error) {
        return res.json({success:false, message: "not authorized"})
    }
} 