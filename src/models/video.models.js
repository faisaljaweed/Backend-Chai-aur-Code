import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoose, { plugin, Schema } from "mongoose";

const videoSchema = new Schema(
  {
    videofile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String, // Cloudnairy url
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      require: true,
    },
    view: {
      type: Number,
      default: 0,
    },
    ispublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
