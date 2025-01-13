"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog'
import { useRouter } from 'next/navigation'
import { Button } from '@workspace/ui/components/button'
function PlayRoyale(): JSX.Element {
  const router = useRouter()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className='font-poppins font-bold'>Play Royale</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='font-poppins font-bold text-2xl'>Play Royale / Tournaments</DialogTitle>
          <DialogDescription className='font-poppins font-normal text-lg'>
            Join or create tournaments to play tournament chess
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className='flex w-full justify-evenly'>
          <Button type="submit" className='font-poppins font-bold' onClick={()=> router.push('tournament/create')}>Create Tournament</Button>
          <Button variant="secondary" className='font-poppins font-bold' onClick={()=>router.push('/jointournament')}> Join Tournament </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default  PlayRoyale