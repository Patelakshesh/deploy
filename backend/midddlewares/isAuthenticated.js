import jwt from 'jsonwebtoken'

const isAuthenticatedd = async (req, res, next) => {
    try{
        console.log("Received Cookies:", req.cookies);
        const token = req.cookies.token; 
        console.log("Extracted Token:", token); 
        if(!token){
            return res.status(401).json({
                message: "User not Authenticated",
                suucess: false,
            })
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message: "Invalid token",
                suucess: false,
            })
        }
        req.id = decode.userId;
        next();
    }catch(error){
        console.log(error)
    }
}
export default isAuthenticatedd;