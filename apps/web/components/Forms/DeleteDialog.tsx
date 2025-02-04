import React from 'react'
import { Button } from '@workspace/ui/components/button'
import {  AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@workspace/ui/components/alert-dialog";
interface DeleteDialogProps {
    tournamentid:string|string[]|undefined


}
import { useRouter } from "next/navigation";
import axios from "axios";
function DeleteDialog({tournamentid}:DeleteDialogProps) {
    const router = useRouter();
    const deleteTournament = async () => {
        try {
          const repsonse = await axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}:3000/api/tournament/delete`,
            
            {
              headers: {
                tournamentid: tournamentid,
              },
            }
          );
          if(repsonse.status === 200){
            router.push("/");
          }
        } catch (error) {
          console.log(error);
    
        }
      };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className='font-poppins font-semibold'>Delete Tournament</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className='font-poppins'>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className='font-poppins'>
            Delete the tournament with id {tournamentid}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='font-poppins font-semibold'>
          <AlertDialogCancel >Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteTournament}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteDialog