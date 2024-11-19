import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { signUp, signIn } from '../store/slices/auth.slice'
import { clearError } from '../store/slices/auth.slice'
import GithubLogin from '../auth/GithubLogin'


const Auth = () => {
    const dispatch = useAppDispatch()
    const { error, isLoading, isFormLoading } = useAppSelector((state) => state.auth)

    const [activeForm, setActiveForm] = useState('signup')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [user_name, setUserName] = useState('')

    const [login_password, setLoginPassword] = useState('')
    const [login_email, setLoginEmail] = useState('')

    const handleFormChange = (form: string) => {
        dispatch(clearError())
        setActiveForm(form)
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const userData = {
                email,
                password,
                user_name,
                first_name,
                last_name
            }
            // Make sure we wrap the user data in a user object
            console.log("FIRST USER FORM", userData)
            const result = await dispatch(signUp(userData))
            console.log("Signup successful:", result)
            // Handle successful signup (e.g., redirect to login or dashboard)
        } catch (error) {
            console.error("Signup failed:", error)
            // Handle error (e.g., show error message to user)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const userData = {
                email: login_email,
                password: login_password
            }
            const result = await dispatch(signIn(userData))
            console.log("Login successful:", result)
            // Handle successful login (e.g., redirect to dashboard)            
        } catch (error) {
            console.error("Login failed:", error)
            // Handle error (e.g., show error message to user)
        }
    }

    return (
        <div className="flex flex-1 flex-col items-center justify-center mb-16">
            {error && <p className="text-red-600">{error}</p>}
            {isLoading && <p>Loading...</p>}
            {isFormLoading && <p>Form Loading...</p>}
            <div>
                <button className={`p-3 ${activeForm === 'signup' ? 'bg-zinc-700 text-blue-300' : 'bg-zinc-600'}`} onClick={() => handleFormChange('signup')}>Sign Up</button>
                <button className={`p-3 ${activeForm === 'login' ? 'bg-zinc-700 text-blue-300' : 'bg-zinc-600'}`} onClick={() => handleFormChange('login')}>Login</button>
            </div>
            <div className='p-6 bg-zinc-700'>
              { activeForm === 'signup' && (
                  <form onSubmit={handleSignUp} className="text-black flex flex-col items-center w-[400px] gap-4">
                      <input
                          type="text"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="border border-gray-400 p-2 w-full"
                      />
                      <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="border border-gray-400 p-2 w-full"
                      />
                      <input
                          type="text"
                          placeholder="First Name"
                          value={first_name}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="border border-gray-400 p-2 w-full"
                      />
                      <input
                          type="text"
                          placeholder="Last Name"
                          value={last_name}
                          onChange={(e) => setLastName(e.target.value)}
                          className="border border-gray-400 p-2 w-full"
                      />
                      <input
                          type="text"
                          placeholder="User Name"
                          value={user_name}
                          onChange={(e) => setUserName(e.target.value)}
                          className="border border-gray-400 p-2 w-full"
                      />
                      <div className='flex w-full flex-row align-middle justify-center items-center gap-4'>
                        <button type="submit" className="bg-blue-600 text-white p-2 flex flex-1 justify-center">Sign Up</button>
                        <GithubLogin />
                      </div>
                      
                  </form>
              )}
              { activeForm === 'login' && (
                  <form onSubmit={handleLogin} className="text-black flex flex-col items-center w-[400px] gap-4">
                      <input
                          type="text"
                          placeholder="Email"
                          value={login_email}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="border border-gray-400 p-2 w-full"
                      />
                      <input
                          type="password"
                          placeholder="Password"
                          value={login_password}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="border border-gray-400 p-2 w-full"
                      />
                      <div className='flex w-full flex-row align-middle justify-center items-center gap-4'>
                        <button type="submit" className="bg-blue-600 text-white p-2 flex flex-1 justify-center">Login</button>
                        <GithubLogin />
                      </div>

                  </form>
              )}
            </div>
        </div>
    )
}

export default Auth