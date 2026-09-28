const checkAdmin = (req,res,next) => {
    try {
        if(req.user && req.user.role === 'admin'){
            return next()
        }
        return res.status(403).json({message:'access denied. Admin rights required.'})
    } catch (error) {
        res.status(500).json({message:'server error'})
    }
}

export default checkAdmin