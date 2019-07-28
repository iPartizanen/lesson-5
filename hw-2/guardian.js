const { Transform } = require('stream');
const { validateChunk } = require('./chunk');

class Guardian extends Transform {
    constructor(encryptor, options = {}) {
        super(options);
        this._encryptor = encryptor;

        this.on('error', ({ message }) => {
            console.log(message);
            process.exit(1);
        });
    }

    _transform(chunk, encoding, done) {
        try {
            validateChunk(chunk);
        } catch ({ message }) {
            this.emit('error', new Error(message));
        }

        const {
            meta: { source },
            payload,
        } = chunk;
        const { name, email, password } = payload;

        const signature = this._encryptor.makeSignature(payload.toString());

        this.push({
            meta: {
                source,
                signature,
            },
            payload: {
                name,
                email: this._encryptor.encrypt(email),
                password: this._encryptor.encrypt(password),
            },
        });
        done();
    }
}

module.exports = Guardian;
