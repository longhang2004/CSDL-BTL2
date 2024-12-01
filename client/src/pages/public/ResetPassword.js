import React, { useState } from 'react'
import { Button } from '../../components'
import { useParams } from 'react-router-dom'
import { apiResetPassword } from '../../apis/user'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const { token } = useParams()
  console.log(token)

  const handleResetPassword = async () => { 
    const response = await apiResetPassword({password, token});
   if(response.success) {
    toast.success(response.mes);
   }
   else toast.info(response.mes);
    
  }
  return (
    <div className='absolute top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
      <div className='flex flex-col gap-4'>
          <label htmlFor='password'>Vui lòng điền mật khẩu mới</label>
          <input 
            type='text'
            id='email'
            className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
            placeholder='Nhập mật khẩu tại đây'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div className='flex items-center justify-end w-full gap-4'>
            {/* <Button 
              name='Back'
              handleOnClick={() => setIsForgotPassword(false)}
              style='px-4 py-2 rounded-md text-white bg-main my-2 text-semibold'
            /> */}
            <Button 
              name='Đổi mật khẩu'
              handleOnClick={handleResetPassword}
            />
          </div>
      </div>
    </div>
  )
}

export default ResetPassword