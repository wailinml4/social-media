import jwt from "jsonwebtoken"

const generateToken = user => {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1hr" })
    return token
}

export default generateToken
