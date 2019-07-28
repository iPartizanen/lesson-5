const crypto = require('crypto');

class Encryptor {
    constructor(password) {
        this._key = crypto.scryptSync(password, crypto.randomBytes(16), 32);
        this._algorithm = 'aes-256-cbc';
        this._encoding = 'utf8';
        this._iv = crypto.randomBytes(16); // static for session
    }

    encrypt(data) {
        const cipher = crypto.createCipheriv(
            this._algorithm,
            this._key,
            this._iv
        );

        return cipher.update(data, this._encoding, 'hex') + cipher.final('hex');
    }

    decrypt(data) {
        const decipher = crypto.createDecipheriv(
            this._algorithm,
            this._key,
            this._iv
        );

        let result = decipher.update(Buffer.from(data, 'hex'));

        result = Buffer.concat([result, decipher.final()]).toString();

        return result;
    }
}

module.exports = Encryptor;
