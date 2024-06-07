"use client"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React from 'react';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"

import Rating from '@mui/material/Rating';
import { Textarea } from "../ui/textarea";
import { IComment } from "@/lib/database/models/comment.model"
import { CommentDefaultValues } from "@/constants";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { createComment, updateComment } from "@/lib/actions/comment.actions";
import { usePathname } from "next/navigation";
import Image from "next/image";

const AddReview = ({ userId, eventId, type, comment }: {
    userId: string,
    eventId: string,
    type: "Create" | "Update",
    comment?: IComment
}) => {

    const pathname = usePathname()
    const [value, setValue] = React.useState<number | null>(comment ? comment.rating : 1);
    const initialValues = comment && type === 'Update' ?
        {
            ...comment
        }
        : CommentDefaultValues;

    const formSchema = z.object({
        title: z.string().min(3, 'Title must be at least 3 characters'),
        description: z.string().min(3, 'Description must be at least 3 characters').max(400, 'Description must be less than 400 characters')
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (type === 'Create') {
            try {
                const newComment = await createComment({
                    comment: { ...values, rating: value },
                    userId,
                    eventId,
                    path: pathname
                })
                if (newComment) {
                    form.reset();
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (type === 'Update') {

            try {
                const updatedComment = await updateComment({
                    userId,
                    comment: {
                        ...values,
                        _id: comment?._id,
                        rating: value
                    },
                    path: pathname,
                }
                )

                if (updatedComment) {
                    form.reset();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {type === "Create" ? <Button className="rounded-full" size='lg' variant={'used'}>Write Your Review</Button> :
                    <Image className="cursor-pointer" src="/assets/icons/edit.svg" alt="edit" width={18} height={18} />
                }

            </DialogTrigger>
            <DialogContent className="bg-[#ffecef]">
                <DialogHeader>
                    {/* <DialogTitle>Create Review</DialogTitle> */}
                    <DialogDescription >

                        <Card className="w-[full] ">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                                    <CardHeader>
                                        <CardTitle>{`${type} Review`}</CardTitle>
                                        {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
                                    </CardHeader>
                                    <CardContent>


                                        <div className="grid w-full items-center gap-4">
                                            <div>
                                                <div className=" font-semibold mb-1">Overall Rating</div>
                                                <Rating
                                                    name="simple-controlled"
                                                    value={value}
                                                    onChange={(event, newValue) => {
                                                        setValue(newValue);
                                                    }}
                                                    size="small"
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="title">Title</Label>
                                                <FormField
                                                    control={form.control}
                                                    name="title"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full ">
                                                            <FormControl>
                                                                <Input placeholder="Review title" {...field} className="rounded-sm textarea " />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="title">Discription</Label>
                                                <FormField
                                                    control={form.control}
                                                    name="description"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormControl className="min-h-44">
                                                                <Textarea placeholder="Description" {...field} className="textarea " />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>


                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <DialogClose asChild>
                                            <Button variant="used">Cancel</Button>
                                        </DialogClose>

                                        <DialogClose asChild>
                                            <Button
                                                type="submit"
                                                disabled={form.formState.isSubmitting}
                                                variant="used"
                                            >
                                                {form.formState.isSubmitting ? (
                                                    'Submitting...'
                                                ) : `${type} Review `}

                                            </Button>
                                        </DialogClose>
                                    </CardFooter>
                                </form>
                            </Form>
                        </Card>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog >
    )
}

export default AddReview;