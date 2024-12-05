import React, { useState, useCallback, useEffect } from 'react'
import { InputField, Button, Loading } from '../../components'
import { apiLogin } from '../../apis/auth'
import Swal from 'sweetalert2'
import { useNavigate, Link } from 'react-router-dom'
import path from '../../utils/path'
import { login } from '../../store/user/userSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { validate } from '../../utils/helper'


const Login = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const [payLoad, setPayLoad] = useState({
    username: '',
    password: ''
  })
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false)
  const [invalidFields, setInvalidFields] = useState([]);
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const resetPayload = () => {   
    setPayLoad({
      username: '',
      password: ''
    })
  } 
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => { 
    resetPayload();
  }, [isRegister])

  const handleSubmit = useCallback(async () => {
    const { username, password} = payLoad;
    const invalids = validate(payLoad, setInvalidFields);
    if(invalids === 0) {
        const response = await apiLogin(payLoad);
        if(response.success) {
          dispatch(login({
            isLoggedIn: true,
            username,
            password
          }))
          Navigate(`/manage-users`);
          Navigate(0);
        }
        else {
          Swal.fire('Đăng nhập thất bại' , response.mes, 'error');
        }
    }
  }, [payLoad, isRegister])
  
  return (
    <div className='w-screen h-screen relative'>
      <div className='absolute top-1/2 bottom-1/2 left-1/2 right-1/2 items-center justify-center flex'>
        <div className='p-8 bg-white rounded-md min-w-[500px]  shadow-2xl border border-cyan-800'>
          <h1 className='text-[28px] font-semibold flex flex-col items-center mb-8'>{'Đăng nhập'}</h1>
          <InputField
            value={payLoad.username}
            setValue={setPayLoad}
            nameKey='username'
            type='text'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <InputField
            value={payLoad.password}
            setValue={setPayLoad}
            nameKey='password'
            type='password'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />

          <Button 
            name={isRegister ? 'Đăng ký' : 'Đăng nhập'}
            handleOnClick={handleSubmit}
            fw
          />

          {/* <div className='flex flex-row items-center justify-between my-2 w-full text-sm'>
            {!isRegister && <span onClick={() => setIsForgotPassword(true)} className='text-blue-500 hover:underline cursor-pointer'>Quên mật khẩu?</span>}
            {!isRegister && <span 
              className='text-blue-500 hover:underline cursor-pointer' onClick={() => setIsRegister(true)}
              >Đăng ký tài khoản</span>}
            {isRegister && <span 
              className='text-blue-500 hover:underline cursor-pointer w-full text-center' 
              onClick={() => setIsRegister(false)}
              >Đăng nhập ngay</span>}
          </div>
          <Link className='text-blue-500 hover:underline cursor-pointer text-sm flex flex-col items-center' to={`/${path.HOME}`}>Trở về trang chủ</Link> */}
        </div>
      </div>
    </div>
  )
}

export default Login