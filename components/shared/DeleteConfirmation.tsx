'use client'

import { useTransition } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { deleteEvent } from '@/lib/actions/event.actions'
import { deleteComment } from '@/lib/actions/comment.actions'

export const DeleteConfirmation = ({ Id, type }: { Id: string, type: "event" | "comment" }) => {
  const pathname = usePathname()
  let [isPending, startTransition] = useTransition()

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Image src="/assets/icons/delete.svg" alt="edit" width={20} height={20} />
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to delete?</AlertDialogTitle>
          <AlertDialogDescription className="p-regular-16 text-grey-600">
            {`This will permanently delete this ${type}`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel >Cancel</AlertDialogCancel>

          <AlertDialogAction
            className='bg-[#fc495b] text-primary-foreground hover:bg-[#f76a79]'
            onClick={() =>
              startTransition(async () => {
                if (type == "event") await deleteEvent({ eventId: Id, path: pathname });
                else await deleteComment({ commentId: Id, path: pathname })
              })
            }>
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}