import { useAppSelector, useAppDispatch } from "../store/hooks"
import { signOut } from "../store/slices/auth.slice"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

const Nav = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const dispatch = useAppDispatch()
  const isAuthPage = useLocation().pathname === "/auth"

  return (
    <div className="h-[60px] w-full bg-zinc-700 flex justify-between px-16">
      <div className="text-3xl flex justify-center items-center w-[200px] h-full">
        <Link to="/">Errorly</Link>
      </div>
      { isAuthenticated
        ? ( <button onClick={() => dispatch(signOut())}>Sign Out</button> )
        : isAuthPage ? null : ( <button className="p-2 text-2xl  bg-zinc-500 flex justify-center items-center w-[150px] hover:bg-zinc-600"><Link to="/auth">Login</Link></button> )
      }
    </div>
  )
}

export default Nav