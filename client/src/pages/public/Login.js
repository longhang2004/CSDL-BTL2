import React, { useState, useCallback, useEffect } from 'react'
import { InputField, Button, Loading } from 'components'
import { apiRegister, apiLogin, apiForgotPassword, apiFinalRegister } from 'apis/user'
import Swal from 'sweetalert2'
import { useNavigate, Link } from 'react-router-dom'
import path from 'utils/path'
import { login } from 'store/user/userSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { validate } from 'utils/helper'


const Login = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const [payLoad, setPayLoad] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    mobile: ''
  })
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false)
  const [invalidFields, setInvalidFields] = useState([]);
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const resetPayload = () => {   
    setPayLoad({
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      mobile: '' 
    })
  } 
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const handleForgotPassword = async () => { 
    const response = await apiForgotPassword({email});
    if(response.success) {
      toast.success(response.mes);
    }
    else {
      toast.info(response.mes);
    }
  }
  useEffect(() => { 
    resetPayload();
  }, [isRegister])

  const handleSubmit = useCallback(async () => {
    const {firstname, lastname, mobile, ...data} = payLoad;
    const invalids = isRegister ? validate(payLoad, setInvalidFields) : validate(data, setInvalidFields);
    if(invalids === 0) {
      if(isRegister) {
        
        const response = await apiRegister(payLoad);
       
        if(response.success) {
          setIsVerifiedEmail(true)
        }
        else {
          Swal.fire('Tạo tài khoản thất bại' , response.mes,'error')
        }
      }
      else {
        const response = await apiLogin(data);
        if(response.success) {
          dispatch(login({
            isLoggedIn: true,
            token: response.accessToken,
            userData: response.userData
          }))
          Navigate(`/${path.HOME}`);
          Navigate(0);
        }
        else {
          Swal.fire('Đăng nhập thất bại' , response.mes, 'error');
        }
      }
    }
  }, [payLoad, isRegister])
  const finalRegister = async () => {
    const response = await apiFinalRegister(token);
    if(response.success) {
      Swal.fire('Chúc mừng', response.mes, 'success').then(() => { 
        setIsRegister(false);
        resetPayload();
      })
    }
    else {
      Swal.fire('Oops!', response.mes, 'error')
    }
    setIsVerifiedEmail(false);
    setToken('');
  }
  return (
    <div className='w-screen h-screen relative'>
      {isVerifiedEmail && 
        <div className='absolute top-0 left-0 right-0 bottom-0 bg-overlay z-50 flex flex-col justify-center items-center'>
          <div className='bg-white w-[500px] rounded-md p-8'>
            <h4>Chúng tôi đã gửi mã xác thực tài khoản qua email của bạn. Vui lòng kiểm tra email và nhập mã: </h4>
            <input type='text'
              value={token}
              onChange={e => setToken(e.target.value)}
              className='p-2 border rounded-md outline-none border-2'
            />
            <button 
              type='button'
              className='px-4 py-2 bg-blue-500 font-semibold text-white rounded-md ml-4'
              onClick={finalRegister}
            > 
              Xác nhận
            </button>
          </div>
        </div>
      }
      {isForgotPassword && 
        <div className='absolute top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
          <div className='flex flex-col gap-4'>
              <label htmlFor='email'>Vui lòng nhập email:</label>
              <input 
                type='text'
                id='email'
                className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
                placeholder='VD: email@gmail.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <div className='flex items-center justify-end w-full gap-4'>
                <Button 
                  name='Trở về'
                  handleOnClick={() => setIsForgotPassword(false)}
                  style='px-4 py-2 rounded-md text-white bg-main my-2 text-semibold'
                />
                <Button 
                  name='Gửi mã '
                  handleOnClick={handleForgotPassword}
                />
              </div>
          </div>
        </div>
      }
      <div className='absolute top-1/2 bottom-1/2 left-1/2 right-1/2 items-center justify-center flex'>
        <div className='p-8 bg-white rounded-md min-w-[500px]  shadow-2xl border border-cyan-800'>
          <h1 className='text-[28px] font-semibold flex flex-col items-center mb-8'>{isRegister? 'Đăng ký' : 'Đăng nhập'}</h1>
          {isRegister && <div className='flex flex-col gap-2'>
            <InputField
                value={payLoad.firstname}
                setValue={setPayLoad}
                nameKey='firstname'
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
              <InputField
                value={payLoad.lastname}
                setValue={setPayLoad}
                nameKey='lastname'
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
            </div>
          }
          <InputField
            value={payLoad.email}
            setValue={setPayLoad}
            nameKey='email'
            type='mail'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          {isRegister && 
            <InputField
              value={payLoad.mobile}
              setValue={setPayLoad}
              nameKey='mobile'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          }
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

          <div className='flex flex-row items-center justify-between my-2 w-full text-sm'>
            {!isRegister && <span onClick={() => setIsForgotPassword(true)} className='text-blue-500 hover:underline cursor-pointer'>Quên mật khẩu?</span>}
            {!isRegister && <span 
              className='text-blue-500 hover:underline cursor-pointer' onClick={() => setIsRegister(true)}
              >Đăng ký tài khoản</span>}
            {isRegister && <span 
              className='text-blue-500 hover:underline cursor-pointer w-full text-center' 
              onClick={() => setIsRegister(false)}
              >Đăng nhập ngay</span>}
          </div>
          <Link className='text-blue-500 hover:underline cursor-pointer text-sm flex flex-col items-center' to={`/${path.HOME}`}>Trở về trang chủ</Link>
        </div>
      </div>
    </div>
  )
}

export default Login