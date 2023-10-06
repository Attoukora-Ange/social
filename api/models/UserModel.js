import mongoose from "mongoose";

const Schema = mongoose.Schema;
const options = {
  timestamps: true,
};

const UserSchema = new Schema(
  {
    photo: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/754/2/png-transparent-samsung-galaxy-a8-a8-user-login-telephone-avatar-pawn-blue-angle-sphere.png",
    },
    nom_prenoms: {
      type: String,
      required: true,
      minlength: [3, "Minimum 3 caratères"],
      uppercase: true,
    },
    pays: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    date_naissance: {
      type: Date,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [4, "Minimum 4 caratères"],
      trim: true,
    },
    codePasseGenere: {
      type: String,
    },
    matrimoniale: {
      type: String,
      trim: true,
    },
    ville: {
      type: String,
      trim: true,
    },
    profession: {
      type: String,
      trim: true,
    },
    biographie: {
      type: String,
      trim: true,
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    suggestion: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
  },
  options
);

export const UserModel = mongoose.model("User", UserSchema);
