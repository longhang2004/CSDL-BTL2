import React, { useEffect, useState } from 'react'
import { Sidebar, Banner, RightBanner, ProductPhone, ProductTablet, ProductHeadphone, ProductLaptop, YourNeed} from '../../components/index'
// import { useSelector, useDispatch } from 'react-redux'
// import {getProduct} from '../../store/product/asyncActions'
// import {apiGetProduct, apiGetPhone } from '../../apis'

const Home = () => {
  return (
    <>
      <div className="w-main flex flex-row p-4">
        {/* Sidebar */}
        <div className='flex flex-col gap-5 w-[20%] flex-auto'>
          <Sidebar />
        </div>
        {/* Slider banner */}
        <div className='flex flex-col pl-5 w-[50%] flex-auto'>
          <Banner />
        </div>
        {/* Right Banner */}
        <div className='flex flex-col gap-5 pl-5 w-[30%] flex-auto'>
          <RightBanner />
        </div>
      </div>
      <div className='w-main flex flex-col py-10'>
        <YourNeed />
      </div>
      <div className='w-main flex flex-col py-10 mt-10'>
        <ProductPhone />
        <ProductLaptop />
        <ProductTablet />
        <ProductHeadphone />
      </div>
    </>
  )
}

export default Home