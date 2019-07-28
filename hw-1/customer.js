const customerAttributes = ['name', 'email', 'password'];

const validateCustomer = data => {
    const { name, email, password } = data;

    if (typeof name !== 'string' || !name) {
        throw new TypeError('Customer name must be non-empty string!');
    }

    if (typeof email !== 'string' || !email) {
        throw new TypeError('Customer email must be non-empty string!');
    }

    if (typeof password !== 'string' || !password) {
        throw new TypeError('Customer paswword must be non-empty string!');
    }

    for (key in data) {
        if (!customerAttributes.includes(key)) {
            throw new Error(`Customer contains non-allowed property '${key}'!`);
        }
    }

    return 0;
};

module.exports = { validateCustomer };
