import crypto from 'crypto';


export const generateMD5Hash = (data) => {
    return crypto.createHash('md5').update(data).digest('hex');
}