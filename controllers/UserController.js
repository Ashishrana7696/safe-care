const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require("../Model/user");
const saltRounds = 10;
require("dotenv").config();


async function milSignUp(req, res) {

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.failure('User already registered!.'); 

  //document creation 
  user = new User({
    "first_name": req.body.first_name,
    "last_name": req.body.last_name,
    "email": req.body.email,
    "password": req.body.password
  });

  const salt = await bcrypt.genSalt(saltRounds);
  user.password = await bcrypt.hash(user.password, salt);

  //document save in the db.
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send({
      "_id": user._id,
      "first_name": req.body.first_name,
      "last_name": req.body.last_name,
      "email": req.body.email
    });
}

async function milSignIn(req, res) {

  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (user === null) {
        res.failure('Your Account does not exists.');
      } else {
        bcrypt.compare(req.body.password, user.password, function (err, result) {
          if (result) {
            const token = jwt.sign({
              email: user.email,
              userId: user.id
            }, process.env.JWT_PRIVATE_KEY, async function (err, token) {

            //   const account = await UserAccount.getUserAccounts([])
            //   const accountsWithUserId = account.recordset.map((accounts) => ({ ...accounts, user_id: user._id }));
            //   UserAccount.deleteAccountsDetails(user._id);
            //   UserAccount.saveUserAccounts(accountsWithUserId);

              res.success({ token_use: token });
            });

          } else {
            res.failure('Invalid Password.');
          }
        })
      }
    })
    .catch(error => {
      res.failure('Invalid Cred.');
    })
}

//because module is encapsulated units that why we exports it  
module.exports = {
  milSignUp: milSignUp,
  milSignIn: milSignIn
}