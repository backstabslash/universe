import { Schema, Document, model } from "mongoose";

export interface IReaction extends Document {
  name: string;
}

const ReactionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Reaction = model<IReaction>("Reaction", ReactionSchema);

export default Reaction;
