const generatePassword = (firstName) => {
  return (
    Math.floor(1000 + Math.floor(Math.random() * 9000)) +
    firstName.toLowerCase() +
    Math.floor(100 + Math.floor(Math.random() * 900))
  );
};

module.exports = generatePassword;
