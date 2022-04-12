import nodemailer from "nodemailer";

const sendCode = (user) => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const content = {
    from: process.env.EMAIL_USERNAME,
    to: user.email,
    subject: "Verification Code",
    text: `Verifiy your email using this code ${user.verificationCode}`,
  };

  transporter.sendMail(content, (error, info) => {
    if (error) {
      res.status(400).send(error);
    }
    res.status(200).send("Verification code has been sent to your email");
  });
};

export default sendCode;
