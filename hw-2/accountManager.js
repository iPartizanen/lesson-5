const { Writable } = require('stream');
const { validateChunk } = require('./chunk');

class AccountManager extends Writable {
    constructor(encryptor, options = {}) {
        super(options);
        this._encryptor = encryptor;
        this._data = [];

        this.on('error', ({ message }) => {
            console.log(message);
            process.exit(1);
        });

        this.on('print', () => {
            this._print();
        });
    }

    _write(chunk, encoding, done) {
        const { meta, payload } = chunk;

        console.log('Payload received by AccountManager: ', payload);

        try {
            validateChunk(chunk);
        } catch ({ message }) {
            this.emit('error', new Error(message));
        }

        const { name, email, password } = payload;

        const decryptedPayload = {
            name,
            email: this._encryptor.decrypt(email),
            password: this._encryptor.decrypt(password),
        };

        if (
            !this._encryptor.verifySignature(
                decryptedPayload.toString(),
                meta.signature
            )
        ) {
            this.emit('error', new Error('Invalid signature!'));
        } else {
            console.log('Signature - ok!');
        }

        this._data.push({
            meta,
            payload: decryptedPayload,
        });

        done();
    }

    _print() {
        this._data.forEach(data => {
            console.log(JSON.stringify(data));
        });
    }
}

module.exports = AccountManager;
