const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({
  email: { type: String, require: true, unique: true},
  password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator); //validates for unique email

module.exports = mongoose.model("User", userSchema);
