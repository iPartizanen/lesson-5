const crypto = require('crypto');

const private_key = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQDGE1TwOHe75mpJUBBH1/MdUUP2tlXNQlzL0udQV4nNmE90GUyq
PDptce+4Pqy41RuAv+LlIEP7KKmGLBfh1Ab652kq86Niga1le5RbxLbKvabiQvt6
9cHcdu3GXh7caz+ekQeN69afyn9Wfsv64GW5ocEKi/vPamf79HNRCP1oKQIDAQAB
AoGAIBgjzCSqKfUExcpGSQ3Ro692PrR+pJqbJJ+QwXDdsEV8okgzJuZJZVBv0j+9
htlo8mylHBElUr3c8hOU7w+G7bmQHrfOATDCFovHuMrOerV6+C8z/C+4i4JxmFnc
0V3RVLAiXOML8hXvuCvyCXNcnTJcmHXC7w622cDxC7iLDV0CQQDv+IjZICnmfN7z
GUUf/ioYbUTNfksk9r8A0Aq52KpIOTShWd7WQ0tR6MSZeMQb3hTRTBZVP7SrkNsu
oShtM8xfAkEA005kuiL1hSX7rP9gvOULr0kmBmus2Gr98+6PILbYg1e9uTfFwoEZ
8LjAhzpAvRpl8SC50PdwHpMJWFQVVQ+YdwJBAIkHQ6WwjxyVa34njOhi60i9hI9P
MbuuxozBP462IS5StDH6rpttG+Ju52y3oExFeV+2cf5F/XYGppIu5nXNIUMCQFKj
4zME/x6+1yo2in/12FcKdaunKudNGNrw3ts9h3n+s72feWFzmlCSAQIiHzWWAG6I
jQOT8i6S9OGtqNYmjksCQBJyyUKX16zjBF8LWHb6oRU/YMWYXAfRcWWzGzVJdZ10
ahzGCeaaDlCZglXDhAfjw4Gc4tUSmCvWknGQZ2+g0PU=
-----END RSA PRIVATE KEY-----`;

const certificate = `-----BEGIN CERTIFICATE-----
MIICezCCAeQCCQDLx/+VSg2xeDANBgkqhkiG9w0BAQsFADCBgTELMAkGA1UEBhMC
VUExDTALBgNVBAgMBEtpZXYxDTALBgNVBAcMBEtpZXYxEDAOBgNVBAoMB1ByaXZh
dGUxEDAOBgNVBAsMB1ByaXZhdGUxDjAMBgNVBAMMBURlbmlzMSAwHgYJKoZIhvcN
AQkBFhFleGFtcGxlQGVtYWlsLmNvbTAeFw0xOTA3MjgxOTM1NTJaFw0xOTA4Mjcx
OTM1NTJaMIGBMQswCQYDVQQGEwJVQTENMAsGA1UECAwES2lldjENMAsGA1UEBwwE
S2lldjEQMA4GA1UECgwHUHJpdmF0ZTEQMA4GA1UECwwHUHJpdmF0ZTEOMAwGA1UE
AwwFRGVuaXMxIDAeBgkqhkiG9w0BCQEWEWV4YW1wbGVAZW1haWwuY29tMIGfMA0G
CSqGSIb3DQEBAQUAA4GNADCBiQKBgQDGE1TwOHe75mpJUBBH1/MdUUP2tlXNQlzL
0udQV4nNmE90GUyqPDptce+4Pqy41RuAv+LlIEP7KKmGLBfh1Ab652kq86Niga1l
e5RbxLbKvabiQvt69cHcdu3GXh7caz+ekQeN69afyn9Wfsv64GW5ocEKi/vPamf7
9HNRCP1oKQIDAQABMA0GCSqGSIb3DQEBCwUAA4GBADhiUDSK7KCG628J6JNsxn+G
PzlP3hsBRqRfljMngeERBc4ePEe6RIx7fvo3wie1PIBvVh6fz+zijTcdi8gNJyR1
fe/kw4cGYY2F/ry+N++9MXktRwKma0xPvLWs8MspnWtMy/lYYPZAA525nxb6VRAf
upYWuGiOkY0bMiNtbJ3A
-----END CERTIFICATE-----`;

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

    makeSignature(data) {
        const sign = crypto.createSign('RSA-SHA256');

        sign.update(JSON.stringify(data));
        sign.end();

        return sign.sign(private_key).toString('hex');
    }

    verifySignature(data, signature) {
        const verify = crypto.createVerify('RSA-SHA256');

        verify.update(JSON.stringify(data));
        verify.end();

        return verify.verify(certificate, Buffer.from(signature, 'hex'));
    }
}

module.exports = Encryptor;
