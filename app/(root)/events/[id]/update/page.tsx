import EventForm from '@/components/shared/EventForm'
import { getEventById } from '@/lib/actions/event.actions';
import { auth } from '@clerk/nextjs';
import React from 'react'
type UpdateEventProps = {
    params: {
        id: string
    }
}

const UpdateEvent = async ({ params: { id } }: UpdateEventProps) => {
    const { sessionClaims } = auth();

    const event = await getEventById(id);

    const userId = sessionClaims?.userId as string;
    return (
        <>
            <section className="bg-[#fff3f5]  bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
                <h3 className="wrapper h3-bold text-center sm:text-left">Update Event</h3>
            </section>

            <div className="wrapper my-8">
                <EventForm userId={userId} event={event} eventId={event._id} type="Update" />
            </div>
        </>
    )
}

export default UpdateEvent