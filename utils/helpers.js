import CryptoJS from "crypto-js";
import md5 from "md5";
import dotenv from "dotenv";
dotenv.config();


const { USER_PASSWORD_SECRET, USER_AUTH_SECRET } = process.env;

console.log("USER_PASSWORD_SECRET:", process.env.USER_PASSWORD_SECRET);
console.log("USER_AUTH_SECRET:", process.env.USER_AUTH_SECRET);




export default {
    passwordHash(password) {
        return md5(md5(password) + USER_PASSWORD_SECRET);
    },

    encrypt: (data, secret = USER_AUTH_SECRET) => {
        return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
    },

    decrypt: (ciphertext, secret = USER_AUTH_SECRET) => {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
}

