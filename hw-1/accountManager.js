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
        console.log('Payload received by AccountManager: ', chunk.payload);

        try {
            validateChunk(chunk);
        } catch ({ message }) {
            this.emit('error', new Error(message));
        }

        const { meta, payload } = chunk;
        const { name, email, password } = payload;

        this._data.push({
            meta,
            payload: {
                name,
                email: this._encryptor.decrypt(email),
                password: this._encryptor.decrypt(password),
            },
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
