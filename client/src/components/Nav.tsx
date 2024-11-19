import { useAppSelector, useAppDispatch } from "../store/hooks"
import { useState } from "react"
import { signOut } from "../store/slices/auth.slice"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

const Nav = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const image_url = useAppSelector((state) => state.user.user.image_url)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dispatch = useAppDispatch()
  const isAuthPage = useLocation().pathname === "/auth"

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="h-[60px] w-full bg-zinc-700 flex justify-between px-16">
      <div className="text-3xl flex justify-center items-center w-[200px] h-full">
        <Link to="/">Errorly</Link>
      </div>
      { isAuthenticated
        ? (
            <div className="flex justify-center items-center gap-4 relative">
              <img src={image_url || "/logo.webp"} onClick={handleMenuToggle} alt="User" className="cursor-pointer w-10 h-10 rounded-full" />
              { isMenuOpen && (
                <div className="absolute top-12 right-4 bg-zinc-600 w-[100px] flex flex-col items-center gap-2 p-2">
                  <Link to="/profile" className="hover:text-blue-300" onClick={handleMenuToggle}>Profile</Link>
                  <button className="hover:text-blue-300" onClick={() => {dispatch(signOut()); handleMenuToggle()}}>Sign Out</button>
                </div>
              )}
            </div>
          )
        : isAuthPage ? null : ( <button className="text-2xl flex justify-center items-center hover:text-blue-300"><Link to="/auth">Login</Link></button> )
      }
    </div>
  )
}

export default Nav


// <button onClick={() => dispatch(signOut())}>Sign Out</button>