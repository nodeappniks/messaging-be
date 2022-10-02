const mongoose = require("mongoose");
const validator = require("validator");
const mongooseIntlPhoneNumber = require("mongoose-intl-phone-number");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please tell us your First Name"],
  },
  lastName: {
    type: String,
    required: [true, "Please tell us your Last Name"],
  },
  email: {
    type: String,
    required: [true, "Please tell us your Last Name"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please tell us your Phone Number"],
  },
  photo: String,
  address: {
    type: String,
    required: [true, "Please enter your Address"],
  },
  userName: {
    type: String,
    unique: true,
    required: [true, "Please enter the User Name"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm the password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Paswwords are not the same",
    },
  },
});

userSchema.plugin(mongooseIntlPhoneNumber, {
  hook: "validate",
  phoneNumberField: "phoneNumber",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
