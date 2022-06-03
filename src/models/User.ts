import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 50,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://res.cloudinary.com/paulodantas/image/upload/v1654291338/blank-profile-picture-973460_640_ojv9v1.png',
    },
    coverPicture: {
      type: String,
      default:
        'https://res.cloudinary.com/paulodantas/image/upload/v1654291608/simple-fb-covers_hutmrq.jpg',
    },
    about: {
      type: String,
      default: '',
    },
    root: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'user',
    },
    gender: {
      type: String,
      default: 'male',
    },
    mobile: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    story: {
      type: String,
      default: '',
      maxlength: 200,
    },
    relationship: {
      type: String,
      default: 'single',
    },
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'user',
      },
    ],
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('users', userSchema);

export default User;
