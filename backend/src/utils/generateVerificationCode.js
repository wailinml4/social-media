import { VERIFICATION_CODE_LENGTH } from "../constants/index.js"

const generateVerificationCode = () => {
    const min = Math.pow(10, VERIFICATION_CODE_LENGTH - 1)
    const max = Math.pow(10, VERIFICATION_CODE_LENGTH) - 1
    return Math.floor(min + Math.random() * (max - min + 1)).toString()
}

export default generateVerificationCode
