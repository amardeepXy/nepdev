import {Link, NavLink, useLocation} from 'react-router-dom'
import { bottombarLinks } from '@/constants'
const Bottombar = () => {

  const { pathname } = useLocation();
  return (
     <ul className='bottom-bar'>
      {bottombarLinks.map(links => {
        let isActive = pathname === links.route
        return(
          <li key={links.label} className={` px-2 py-1.5 rounded-lg ${isActive? 'bg-red text-light-1' : ''}`}>
            <NavLink to={links.route} className={`flex flex-col gap-y-1 items-center`}>
              <img src={links.imgURL} alt={links.label} className={`sm:w-6 sm:h-6 md:w-5 md:h-5 ${isActive && 'invert-white'}`} />
              <p >{links.label}</p>
            </NavLink>
          </li>
        )
      })}
     </ul>
  )
}

export default Bottombar