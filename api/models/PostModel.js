import mongoose from "mongoose";

const Schema = mongoose.Schema;
const options = {
  timestamps: true,
};

const PostSchema = new Schema(
  {
    postUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
    like: {
      type: [Schema.Types.ObjectId],
    },

    commentaire: {
      type: [
        {
          commentaireUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          commentairetexte: {
            type: String,
            trim: true,
          },
          timestamp: { type: Date, default: Date.now },
        },
      ],
      required: true,
    },
  },
  options
);

const InformationSchema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: [3, "Minimum 3 caratères"],
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Minimum 3 caratères"],
    },
    fichier: {
      type: String,
      required: true,
    },
  },
  options
);

const ProblemeSchema = new Schema(
  {
    postUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nature: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  options
);
export const PostModel = mongoose.model("Post", PostSchema);
export const InformationModel = mongoose.model(
  "Informations",
  InformationSchema
);
export const ProblemeModel = mongoose.model("Probleme", ProblemeSchema);
