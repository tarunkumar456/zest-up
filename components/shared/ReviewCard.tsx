
import { IComment } from "@/lib/database/models/comment.model";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"

import { Avatar } from "@mui/material";
import Rating from "@mui/material/Rating";
import { findUserById } from "@/lib/actions/user.actions";
import { formatDateTime } from "@/lib/utils";
import { DeleteConfirmation } from "./DeleteConfirmation";
import AddReview from "./AddReview";

const ReviewCard = async ({ comment, userId }: { comment: IComment, userId: string }) => {

    const isWriter = userId === comment.by.toString();
    const writer = await findUserById(comment.by);

    return (
        <Card className="w-[400px] h-[400px] bg-[#fedee4] overflow-y-auto mb-8">
            <CardHeader>
                <div className="flex items-center justify-between" >
                    <div>
                        <div className="flex items-center">
                            <Avatar />
                            <CardDescription className=" ml-2 text-md text-slate-950">{`${writer[0].firstName}  ${writer[0].lastName}`}</CardDescription>
                        </div>
                        <Rating
                            value={comment.rating}
                            size="small"
                            readOnly
                        />
                    </div>

                    {
                        isWriter &&
                        <div className=" flex flex-col gap-2 rounded-sm  bg-white p-2 shadow-sm transition-all">
                            <AddReview type="Update" userId={comment.by} eventId={comment.eventId} comment={comment} />

                            <DeleteConfirmation Id={comment._id} type='comment' />
                        </div>
                    }
                </div>

                <div className=" text-[#898888]">
                    {`Reviewed on ${formatDateTime(comment.createdAt).onlyDate}`}
                </div>

            </CardHeader>
            <CardContent className=" mt-[-14px]">
                <div className=" font-semibold ">
                    {comment.title}
                </div>
                <div >
                    {comment.description}
                </div>
            </CardContent>
        </Card>
    )
}

export default ReviewCard;