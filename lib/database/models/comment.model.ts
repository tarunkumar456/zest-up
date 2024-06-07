import { Document, Schema, model, models } from "mongoose";

export interface IComment extends Document {
    title?: string;
    description?: string;
    createdAt: Date;
    rating: 1 | 2 | 3 | 4 | 5;
    by: string;
    eventId:string;
}

const CommentSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    rating: {
        type: Number,
        required: true
    },
    by: { type: Schema.Types.ObjectId, ref: 'User' },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
});

const Comment = models.Comment || model('Comment', CommentSchema);

export default Comment;