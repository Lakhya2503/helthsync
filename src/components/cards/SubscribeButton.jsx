import React from 'react'
import Button from '../Button'
import Input from '../Input'

const SubscribeButton = () => {
  return (
    <div className="flex flex-col gap-3">
            <h3 className='text-2xl text-center'>Subscribe to our newsletter</h3>
            <div className="flex gap-2">
                    <Input placeholder="Enter your email" className={`text-[15px] px-4 py-4 w-[22vw] bg-white rounded-full`}/>
                    <Button className={`text-[18px] px-3  rounded-full text-white bg-[#0078E5]`}>
                        {`Subscribe`}
                    </Button>
            </div>
    </div>
  )
}

export default SubscribeButton