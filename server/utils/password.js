const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

const comparePassword = (password, encryptedPassword) =>
  bcrypt.compare(password, encryptedPassword);

module.exports = {
  hashPassword,
  comparePassword,
};
