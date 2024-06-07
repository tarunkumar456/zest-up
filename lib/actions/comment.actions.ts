'use server'
import {
    CreateCommentParams,
    DeleteCommentParams,
    UpdateCommentParams,
    //  UpdateCommentParams 
} from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Comment from "../database/models/comment.model"
import User from "../database/models/user.model"
import { revalidatePath } from "next/cache"
import Event from "../database/models/event.model"

export const createComment = async ({ userId, comment, eventId, path }: CreateCommentParams) => {
    try {
        await connectToDatabase();
        const by = await User.findById(userId);
        if (!by) {
            throw new Error("Writer not found");
        }
        const newComment = await Comment.create({ ...comment, by: userId, eventId: eventId });
        if (newComment) {
            let eventToUpdate = await Event.findById(eventId)
            const rating = eventToUpdate.rating;
            const length = eventToUpdate.reviews;
            const newRating = (rating * length + (comment.rating ? comment.rating : 0)) / (length + 1);
            eventToUpdate.rating = newRating;
            eventToUpdate.reviews = length + 1;
            const updatedEvent = await Event.findByIdAndUpdate(
                { _id: eventId },
                { ...eventToUpdate },
                { new: true }
            )
            revalidatePath(path)
        }
        return JSON.parse(JSON.stringify(newComment));
    }
    catch (error) {
        handleError(error)
    }
}

export async function updateComment(data: UpdateCommentParams) {
    try {
        await connectToDatabase()
        const _id = data.comment._id;

        const commentToUpdate = await Comment.findById(_id)
        if (!commentToUpdate || commentToUpdate.by.toHexString() !== data.userId) {
            throw new Error('Unauthorized or event not found')
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            _id,
            { ...data.comment },
            { new: true }
        )
        if (updatedComment) {
            let eventToUpdate = await Event.findById(commentToUpdate.eventId)
            const rating = eventToUpdate.rating;
            const length = eventToUpdate.reviews;
            const newRating = (rating * length + (data.comment.rating ? data.comment.rating : 0) - commentToUpdate.rating) / (length);
            eventToUpdate.rating = newRating;
            eventToUpdate.reviews = length;
            const updatedEvent = await Event.findByIdAndUpdate(
                { _id: commentToUpdate.eventId },
                { ...eventToUpdate },
                { new: true }
            )
            revalidatePath(data.path)
        }

        return JSON.parse(JSON.stringify(updatedComment))
    } catch (error) {
        handleError(error)
    }
}

export async function deleteComment({ commentId, path }: DeleteCommentParams) {
    try {
        await connectToDatabase()
        const commentToDelete = await Comment.findById(commentId);

        const deletedComment = await Comment.findByIdAndDelete(commentId)
        if (deletedComment) {
            let eventToUpdate = await Event.findById(commentToDelete.eventId)
            const rating = eventToUpdate.rating;
            const length = eventToUpdate.reviews;
            const newRating = length > 1 ? (rating * length - (commentToDelete.rating ? commentToDelete.rating : 0)) / (length - 1) : 0;
            eventToUpdate.rating = newRating;
            eventToUpdate.reviews = length - 1;
            const updatedEvent = await Event.findByIdAndUpdate(
                { _id: commentToDelete.eventId },
                { ...eventToUpdate },
                { new: true }
            )
            revalidatePath(path)
        }
    } catch (error) {
        handleError(error)
    }
}
export async function getCommentByEvent({ eventId }: { eventId: string }) {
    try {
        await connectToDatabase()

        const conditions = { eventId: eventId }

        const Comments = await Comment.find(conditions)
            .sort({ createdAt: 'desc' })

        const CommentCount = await Comment.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(Comments)), totalComment: CommentCount }
    } catch (error) {
        handleError(error)
    }
}