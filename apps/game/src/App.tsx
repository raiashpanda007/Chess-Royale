import { useState } from 'react'
import {Button} from '@workspace/ui/components/button'
import {Alert} from "@workspace/ui/components/alert"

function App() {
  const [count, setCount] = useState(0)

  return (
   <div className='text-red-500 font-bold text-2xl font-poppins'> 
    hi there
    <Button className='font-poppins t' onClick={() => setCount(count + 1)}>Button</Button>
   </div>
  )
}

export default App
