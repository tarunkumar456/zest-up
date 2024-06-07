import { getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.actions'
import { SearchParamProps } from '@/types'
import Image from 'next/image';
import { formatDateTime } from '@/lib/utils';
import React from 'react'
import Link from 'next/link';
import Collection from '@/components/shared/Collection';
import CheckoutButton from '@/components/shared/CheckoutButton';
import AddReview from '@/components/shared/AddReview';
import { auth } from '@clerk/nextjs';
import { getCommentByEvent } from '@/lib/actions/comment.actions';
import { IComment } from '@/lib/database/models/comment.model';
import ReviewCard from '@/components/shared/ReviewCard';
import { Rating } from '@mui/material';


const EventDetails = async ({ params: { id }, searchParams }: SearchParamProps) => {

    const event = await getEventById(id);
    const { sessionClaims } = auth();
    const AllComments = await getCommentByEvent({ eventId: id });
    // console.log(AllComments)

    const userId = sessionClaims?.userId as string;
    // console.log(event);
    const relatedEvents = await getRelatedEventsByCategory({
        categoryId: event.category._id,
        eventId: event._id,
        page: searchParams.page as string,
    })

    return (
        <div>
            <section className="flex justify-center bg-[#fff3f5] bg-dotted-pattern bg-contain">
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
                    <div >
                        <Image
                            src={event.imageUrl}
                            alt="hero image"
                            width={1000} height={1000}
                            className="h-full min-h-[300px] object-center "
                        />
                    </div>

                    <div className="flex w-full flex-col gap-8 p-5 md:p-10">
                        <div className="flex flex-col gap-6">
                            <h2 className='h2-bold'>{event.title}</h2>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="flex gap-3">
                                    <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                                        {event.isFree ? 'FREE' : `$${event.price}`}
                                    </p>
                                    <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                                        {event.category.name}
                                    </p>
                                </div>

                                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                                    by{' '}
                                    <span className="text-primary-500">{event.organizer.firstName} {event.organizer.lastName}</span>
                                </p>
                            </div>
                            <div className='flex items-center gap-1'>
                                {event.rating.toFixed(1)}
                                <Rating
                                    precision={0.1}
                                    value={event.rating}
                                    readOnly
                                />
                                {
                                    `(${event.reviews} ratings)`
                                }
                            </div>
                        </div>

                        <CheckoutButton event={event} />

                        <div className="flex flex-col gap-5">
                            <div className='flex gap-2 md:gap-3'>
                                <Image src="/assets/icons/calendar.svg" alt="calendar" width={32} height={32} />
                                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                                    <p>
                                        {formatDateTime(event.startDateTime).dateOnly} - {' '}
                                        {formatDateTime(event.startDateTime).timeOnly}
                                    </p>

                                    <p>
                                        {formatDateTime(event.endDateTime).dateOnly} -  {' '}
                                        {formatDateTime(event.endDateTime).timeOnly}
                                    </p>
                                </div>
                            </div>

                            <div className="p-regular-20 flex items-center gap-3">
                                <Image src="/assets/icons/location.svg" alt="location" width={32} height={32} />
                                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="p-bold-20 text-grey-600">Details :</p>
                            <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
                            <Link href={event.url} target='blank' ><p className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline">{event.url}</p></Link>
                        </div>
                    </div>
                </div>
            </section>
            <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
                <AddReview userId={userId} eventId={id} type="Create" />
                <h2 className="h2-bold">Top Reviews</h2>
                <div className='flex flex-wrap gap-6'>
                    {
                        (AllComments && AllComments.totalComment > 0) ?
                            (
                                AllComments.data.map((com: IComment, ind: number) => {
                                    return <ReviewCard comment={com} key={ind} userId={userId} />
                                })
                            )
                            :
                            (
                                <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
                                    <h3 className="p-bold-20 md:h5-bold">No Review</h3>
                                    <p className="p-regular-14">Be the first one to share your experience!</p>
                                </div>
                            )


                    }
                </div>


            </section>
            {/* EVENTS with the same category */}
            <section className="wrapper mt-[-30px] mb-8 flex flex-col gap-8 md:gap-12">
                <h2 className="h2-bold">Related Events</h2>

                <Collection
                    data={relatedEvents?.data}
                    emptyTitle="No Events Found"
                    emptyStateSubtext="Come back later"
                    collectionType="All_Events"
                    limit={3}
                    page={searchParams.page as string}
                    totalPages={relatedEvents?.totalPages}
                />
            </section>
        </div>
    )
}

export default EventDetails