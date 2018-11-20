// const bcrypt = require('bcryptjs');
//
// // bcrypt.genSalt(10, function(err, salt) {
// //     bcrypt.hash("mypassword", salt, function(err, hash) {
// //         console.log(hash);
// //     });
// // });
// bcrypt.compare("mypassword", "$2a$10$0/JZ.ndoOhgDjf9JoZIWA.FP6.hBNyLyeokz5q5ZtL2SRaPxsWSbC").then((res) => {
//     // res === true
//     console.log(res)
// });
let sgMail = require("@sendgrid/mail"),
  keys = require("../config/keys");
sgMail.setApiKey(keys.SENDGRID_API);
const msg = {
  from: "support@fortminor.com",
  to: "ilikeitmyway1998@gmail.com",
  subject: "Request Update",
  html: `<h3>Welcome to FortMinor!</h3><b>Your request has been successfully posted. You will be contacted shortly by our team.</b>`
};

//status : 1; timeout
sgMail.send(msg, (err, info) => {
  console.log(err, info);
  if (err) return res.send(err);
  //res.send(info);
  // if (info[0].statusCode === 202) {
  //   return res.send({ status: 2 });
  // }
});
