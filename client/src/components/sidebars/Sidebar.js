import { NavLink } from 'react-router-dom'
import { createSlug } from 'utils/helper'
import { useSelector } from 'react-redux'

const Sidebar = () => {
  const { categories } = useSelector(state => state.app)
  return (
    <div className='flex flex-col h-full justify-between border-2 rounded-md shadow-xl'>
      {categories?.map(el => (
        <NavLink
          key={createSlug(el.name)}
          to={createSlug(el.name)}
          className={({isActive}) => isActive 
          ? 'bg-main text-white hover:text-main' 
          : 'px-5 pt-[15px] pb-[15px] text-sm hover:text-main'}
        >
          {el.name}
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar