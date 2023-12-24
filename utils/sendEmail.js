const nodemailer = require("nodemailer");

const sendEmail = (firstName, lastName, email, randomPassword) => {
  // Step 1
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER, // gmail account
      pass: process.env.PASS, // gmail password
    },
  });
  // Step 2
  let mailOptions = {
    from: process.env.USER, //  sender
    to: email, // receiver
    subject: "Ropstam-car Confirmation",
    html: `Dear ${firstName} ${lastName}, your password for <b>Ropstam-car</b> is:  <h1>${randomPassword}</h1>
      <br /> Now you can log in to your account with this password. Thanks`,
  };
  //  Step 3
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return console.log(err);
    }
    return console.log("Email sent successfully");
  });
};

module.exports = sendEmail;
