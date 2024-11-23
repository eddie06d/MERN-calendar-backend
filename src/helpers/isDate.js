const { isValid } = require('date-fns');

const isDate = (value) => {
    if(!value) return false;

    return isValid(value);
};

module.exports = {
    isDate
};