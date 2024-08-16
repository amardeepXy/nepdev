import { Outlet } from 'react-router-dom'
import { Topbar, Leftbar, Bottombar } from '../components/shared';

const RootLayout = () => {
 
  return ( <>
  <div className='md:flex w-full'>
    <Topbar/>
    <Leftbar/>
    <section className='flex flex-1 h-screen'>
    <Outlet/>
    </section>
    <Bottombar/>
  </div>
  </>)
}

export default RootLayout