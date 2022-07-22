const mongoose      = require("mongoose");
const userSchema    = require("../schemas/user.schema")

//model name is also in singular and table name(Collection name) is also create with plural name
//collection creation
const User = mongoose.model("User", userSchema);


exports.User = User;