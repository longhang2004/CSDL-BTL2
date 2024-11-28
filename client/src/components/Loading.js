import React, {memo} from 'react'
import {HashLoader} from 'react-spinners'
const Loading = () => {
  return (
    <HashLoader color='#d70018'/>
  )
}

export default memo(Loading)