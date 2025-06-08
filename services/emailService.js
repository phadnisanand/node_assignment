const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendProductPhotoEmail = async (to, productName, photoUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Product Photo: ${productName}`,
    html: `<p>Check out this product photo:</p><img src="${photoUrl}" alt="${productName}" />`
  };
  await transporter.sendMail(mailOptions);
};