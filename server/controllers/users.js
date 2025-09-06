const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const { encryptSymmetric, decryptSymmetric } = require("../utils/crypto");
const jwt = require("jsonwebtoken");
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const nodemailer = require("nodemailer");
const randomize = require("randomatic");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // details check
    if (!username || !email || !password)
      return res.status(400).json({ message: "Zadejte všechny detaily" });

    if (password.length < 8 || password.length > 64)
      return res
        .status(500)
        .send({ message: "Heslo musí být 8-64 znaků dlouhé" });

    // existing user check
    const emailExists = await Users.findOne({ email });
    if (emailExists)
      return res
        .status(400)
        .json({ message: "Tento email je již zaregistrován" });
    const usernameExists = await Users.findOne({ username });
    if (usernameExists)
      return res.status(400).json({ message: "Toto jméno bylo již použito" });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = new Users({
      username: username,
      email: email,
      password: passwordHash,
    });

    const result = await user.save();
    if (result) {
      // login
      const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return res.status(200).send({
        message: "User created",
        payload: result,
        token,
      });
    }
    res.status(500).send({
      message: "User not created",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Zadejte všechny detaily" });

    const findUser = await Users.findOne({ email });
    if (!findUser)
      return res.status(400).json({ message: "Uživatel nenalezen" });

    if (!(await bcrypt.compare(password, findUser.password)))
      return res.status(400).send({
        message: "Neplatné údaje",
      });

    const otp = randomize("0", 6);
    findUser.otp = otp;
    // 1 min expiration
    findUser.otpExpiresIn = Date.now() + 60000;
    findUser.save();

    sendOTP(email, otp);

    // otp token (also 1 min)
    const token = jwt.sign(
      { id: findUser._id, stage: "OTP" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
      }
    );

    return res.status(200).send({
      message: "Logged in successfully, waiting for OTP verification",
      token,
    });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getPasswords = async (req, res, next) => {
  try {
    const savedPasswords = req.user.savedPasswords.map((item) => ({
      ...item.toObject(),
      password: decryptSymmetric(JSON.parse(item.password)),
    }));
    res.status(200).send({
      payload: savedPasswords,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

exports.addPassword = async (req, res, next) => {
  try {
    const { url, password, note } = req.body;
    if (!url || !password)
      return res.status(400).json({ message: "Invalid format" });

    const user = req.user;

    const encrypted = encryptSymmetric(password);

    user.savedPasswords.push({
      url,
      password: JSON.stringify(encrypted),
      note,
    });

    const result = await user.save();

    if (result) {
      const savedPasswords = req.user.savedPasswords.map((item) => ({
        ...item.toObject(),
        password: decryptSymmetric(JSON.parse(item.password)),
      }));

      return res.status(200).send({
        message: "Password saved",
        payload: savedPasswords,
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.removePassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).send({ message: "ID of password is required" });

    const user = req.user;
    user.savedPasswords = user.savedPasswords.filter(
      (item) => item._id.toString() !== id
    );
    const result = await user.save();
    if (result) {
      return res.status(200).send({
        message: "Password removed",
        payload: user.savedPasswords,
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ message: "OTP not provided" });

    const findUser = await Users.findOne({ otp });
    if (!findUser) return res.status(400).json({ message: "Zadán špatný kód" });

    if (findUser.otpExpiresIn < Date.now())
      return res.status(400).json({ message: "Verifikační kód vypršel" });

    //console.log(findUser);
    findUser.otp = "";
    findUser.otpExpiresIn = "";
    await findUser.save();

    const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).send({
      token,
      payload: findUser,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
};

const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pass.manager.help.email@gmail.com",
        pass: GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: "Manažér hesel",
        address: "pass.manager.help.email@gmail.com",
      },
      to: email,
      subject: "Dvoufázová verifikace",
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="und">
   <head>
      <meta http-equiv="Content-Security-Policy" content="script-src 'unsafe-inline' https://scripts.claspo.io; connect-src 'none'; object-src 'none'; form-action 'none';">
      <meta charset="UTF-8">
      <meta content="width=device-width, initial-scale=1" name="viewport">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta content="telephone=no" name="format-detection">
      <title>Verifikační kód</title>
      <!--[if (mso 16)]>
      <style type="text/css">
         a {text-decoration: none;}
      </style>
      <![endif]--><!--[if gte mso 9]>
      <style>sup { font-size: 100% !important; }</style>
      <![endif]--><!--[if gte mso 9]>
      <noscript>
         <xml>
            <o:OfficeDocumentSettings>
               <o:AllowPNG></o:AllowPNG>
               <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
         </xml>
      </noscript>
      <![endif]--><!--[if !mso]><!-- -->
      <link href="https://fonts.googleapis.com/css2?family=Inter&amp;display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600&amp;display=swap" rel="stylesheet">
      <!--<![endif]-->
      <style type="text/css">#outlook a {
         padding:0;
         }
         .ch {
         mso-style-priority:100!important;
         text-decoration:none!important;
         }
         a[x-apple-data-detectors] {
         color:inherit!important;
         text-decoration:none!important;
         font-size:inherit!important;
         font-family:inherit!important;
         font-weight:inherit!important;
         line-height:inherit!important;
         }
         .bn {
         display:none;
         float:left;
         overflow:hidden;
         width:0;
         max-height:0;
         line-height:0;
         mso-hide:all;
         }
         .ci:hover a.ch, .ci:hover button.ch {
         background:#49E2B6!important;
         }
         .ci:hover {
         border-color:#42d159 #42d159 #42d159 #42d159!important;
         background:#49E2B6!important;
         border-style:solid solid solid solid!important;
         }
         @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:30px!important; text-align:left } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left }   .cp h3 a, .co h3 a, .cn h3 a { font-size:20px!important; text-align:left }  .cp p, .cp ul li, .cp ol li, .cp a { font-size:14px!important } .co p, .co ul li, .co ol li, .co a { font-size:14px!important } .cn p, .cn ul li, .cn ol li, .cn a { font-size:12px!important } .cm p, .cm ul li, .cm ol li, .cm a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .ck, .ck h1, .ck h2, .ck h3 { text-align:center!important }  .cl, .cl h1, .cl h2, .cl h3 { text-align:left!important } .cj img, .ck img, .cl img { display:inline!important } .ci { display:inline-block!important } a.ch, button.ch { font-size:18px!important; display:inline-block!important } .ce table, .cf, .cg { width:100%!important } .cb table, .cc table, .cd table, .cb, .cd, .cc { width:100%!important; max-width:600px!important }  .adapt-img { width:100%!important; height:auto!important }  .by { padding-right:0!important }    .bu { padding-bottom:20px!important }       table.bp, .esd-block-html table { width:auto!important } table.bo { display:inline-block!important } table.bo td { display:inline-block!important }                                         }
         @media screen and (max-width:384px) {.mail-message-content { width:414px!important } }
      </style>
      <style>*{scrollbar-width: thin;scrollbar-color: #888 transparent;}/* Chrome, Edge, Safari */::-webkit-scrollbar {width: 10px;height: 10px;}::-webkit-scrollbar-track {background: transparent;}::-webkit-scrollbar-thumb {background: #888;border-radius: 6px;border: 2px solid transparent;}::-webkit-scrollbar-thumb:hover {box-shadow: inset 0 0 6px rgba(0,0,0,0.3);}textarea::-webkit-scrollbar-track {margin: 15px;}</style>
   </head>
   <body style="width:100%;font-family:Inter, Arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
      <div dir="ltr" class="es-wrapper-color" lang="und" style="background-color:#F6F6F6">
         <!--[if gte mso 9]>
         <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#f6f6f6"></v:fill>
         </v:background>
         <![endif]-->
         <table class="cb" cellspacing="0" cellpadding="0" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
            <tbody>
               <tr>
                  <td align="center" style="padding:0;Margin:0">
                     <table class="co" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                        <tbody>
                           <tr>
                              <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px">
                                 <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tbody>
                                       <tr>
                                          <td class="by bu" valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                             <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tbody>
                                                   <tr>
                                                      <td align="left" style="padding:0;Margin:0;padding-bottom:10px">
                                                         <h1 style="Margin:0;line-height:38.4px;mso-line-height-rule:exactly;font-family:Inter, Arial, sans-serif;font-size:32px;font-style:normal;font-weight:bold;color:#191335;text-align:center;">Dvoufázová verifikace</h1>
                                                      </td>
                                                   </tr>
                                                   <tr>
                                                      <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px">
                                                         <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Inter, Arial, sans-serif;line-height:24px;color:#191335;font-size:16px"><br></p>
                                                         <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Inter, Arial, sans-serif;line-height:24px;color:#191335;font-size:16px">Pro zvýšení zabezpečení vašeho účtu vyžadujeme pro přístup dvoufázové ověřování. Zde je váš verifikační kód:</p>
                                                      </td>
                                                   </tr>
                                                </tbody>
                                             </table>
                                          </td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </td>
                           </tr>
                           <tr>
                              <td align="left" bgcolor="#F2FBFF" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px;background-color:#fbfbfb">
                                 <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tbody>
                                       <tr>
                                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                                             <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tbody>
                                                   <tr>
                                                      <td align="center" class="ck" style="padding:0;Margin:0;padding-bottom:10px">
                                                         <h1 style="Margin:0;line-height:38.4px;mso-line-height-rule:exactly;font-family:Inter, Arial, sans-serif;font-size:32px;font-style:normal;font-weight:bold;color:#191335">${otp}</h1>
                                                      </td>
                                                   </tr>
                                                   <tr>
                                                      <td align="center" style="padding:0;Margin:0;padding-top:10px">
                                                         <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Inter, Arial, sans-serif;line-height:19.5px;color:#999999;font-size:13px">Kód vyprší za 60 sekund</p>
                                                      </td>
                                                   </tr>
                                                </tbody>
                                             </table>
                                          </td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </td>
                           </tr>
                           <tr>
                              <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px">
                                 <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tbody>
                                       <tr>
                                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                                             <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tbody>
                                                   <tr>
                                                      <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px">
                                                         <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Inter, Arial, sans-serif;line-height:24px;color:#191335;font-size:16px;text-align:center;">Nikdy s nikým nesdílejte své 2FA kódy.</p>
                                                      </td>
                                                   </tr>
                                                </tbody>
                                             </table>
                                          </td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
   </body>
</html>
      `,
      text: `Váš verifikační kód je ${otp}`,
      headers: {
        "x-priority": "1",
        "x-msmail-priority": "High",
        importance: "high",
      },
    };

    await transporter.sendMail(mailOptions);
    //console.log("Email sent: " + info.response);
  } catch (e) {
    console.error(e);
  }
};
