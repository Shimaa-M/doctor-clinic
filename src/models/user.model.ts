import * as mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { IUserDoc, IUserModel } from '../DTO/user.dto';
import { Roles } from '../enum/role.enum';
//creating schema
const userSchema =new  mongoose.Schema<IUserDoc, IUserModel>({
  _id: {
    type: mongoose.Types.ObjectId,
    default:new mongoose.Types.ObjectId()
  },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
  role: {
    type: String,
    enum: Roles
  }
});
userSchema.static('isEmailTaken', async function (email: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
  const users = await this.find()
  if (users.length) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  }else return false
});

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', async function (password: string): Promise<boolean> {
  const user = this;
  return bcrypt.compare(password, user.password);
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
//creating model
 const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export default User;

