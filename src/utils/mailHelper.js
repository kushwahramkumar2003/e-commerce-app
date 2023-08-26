import config from "../config/index.js";
import transporter from "../config/transporter.config.js";
import asyncHandler from "../service/asyncHandler";

const mailHelper = asyncHandler(async (mailOptions) => {
  const message = {
    from: config.SMTP_MAIL_FROM,
    to: mailOptions.to,
    subject: mailOptions.subject,
    html: mailOptions.html,
    text: mailOptions.text,
  };

  await transporter.sendMail(message);
});

export default mailHelper;
