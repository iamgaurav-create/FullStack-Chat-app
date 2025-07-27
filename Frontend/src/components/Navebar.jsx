import React from 'react'
import {Link, Links, NavLink} from 'react-router-dom';
import { userAuthStore } from '../store/userAuthStore'
import {LogOut, MessageSquare, Settings, User} from 'lucide-react'

import ChangeTheme from './ChangeTheme';

const Navebar = () => {

  const { logout, authUser} = userAuthStore();
  return (
   <header className='bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg shadow-md'>
     <div className='container mx-auto px-4 h-12 flex items-center justify-between  '>
       <div className="flex items-center justify-between gap-8">
            <Link to="/" className="flex py-[5px] items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                {/* <MessageSquare className="w-5 h-5 text-primary" /> */}
                <img src="dist\assets\icon.png" alt="" />
              </div>
              <h1 className="text-lg font-bold">Bondly</h1>
            </Link>
          </div>
          <div className='flex items-center gap-2'>
            
            
              <ChangeTheme  />
            
            

{authUser && (
  <>
    <Link to="/profile" className="btn btn-sm gap-2">
      <User className="size-5" />
      <span className="hidden sm:inline">Profile</span>
    </Link>

    <button className="flex gap-2 items-center cursor-pointer" onClick={logout}>
      <LogOut className="size-5" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  </>
)}


          </div>
     </div>
   </header>
  )
}

export default Navebar