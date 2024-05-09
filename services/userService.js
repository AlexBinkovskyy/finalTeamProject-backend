import nodemailer from "nodemailer";

export const checkTokenPlusUser = async (id, dbToken) => {
    const user = await User.findById(id, { password: 0 });
    if (!user) return false;
    const comparetokens = user.token === dbToken ? true : false;
    return comparetokens ? user : false;
  };

  export const deleteTokenFromUser = async (userData) => {
    userData.token = null;
    const user = await User.findByIdAndUpdate(userData.id, userData, {
      new: true,
    });
    return user ? true : false;
  };

  export const emailService = async (user) => {
    const { email, verificationToken } = user;
  
    const config = {
      host: process.env.POST_SERVICE_HOST,
      port: process.env.POST_SERVICE_PORT,
      secure: true,
      auth: {
        user: process.env.POST_SERVICE_USER,
        pass: process.env.POST_SERVICE_PASSWORD,
      },
    };
  
    const transporter = nodemailer.createTransport(config);
    const emailOptions = {
      from: process.env.POST_SERVICE_USER,
      to: email,
      subject: "EMAIL VERIFICATION CODE",
      text: "verivication link",
      html: emailTemplate(`https://finalteamproject-backend.onrender.com/index.html?${verificationToken}`),
    };
    await transporter
      .sendMail(emailOptions)
      .then((info) => console.log("1", info))
      .catch((err) => console.log("2", err));
  };