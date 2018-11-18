const bcrypt = require('bcryptjs');

// bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash("mypassword", salt, function(err, hash) {
//         console.log(hash);
//     });
// });
bcrypt.compare("mypassword", "$2a$10$0/JZ.ndoOhgDjf9JoZIWA.FP6.hBNyLyeokz5q5ZtL2SRaPxsWSbC").then((res) => {
    // res === true
    console.log(res)
});