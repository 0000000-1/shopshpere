import jwt from 'jsonwebtoken'

export const generateToken = (userId,isAdmin)=>{
    const payload = {id:userId,isAdmin:isAdmin}

    return jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN || '7d',
    })
}