import { useAppSelector } from "../store/hooks"
import { useEffect, useState } from "react"
import { NewProfile } from "../types/db"

const Profile = () => {
    const [profile, setProfile] = useState<NewProfile | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<NewProfile>({
        banner_url: '',
        description: ''
    })
    const user = useAppSelector((state) => state.user.user)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:3000/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: 'include',
            })
            const data = await response.json()
            
            if (response.ok) {
                setProfile(data.profile[0])
                setFormData(data.profile[0])
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const method = profile ? 'PUT' : 'POST'
        
        try {
            const response = await fetch('http://localhost:3000/profile', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            if (response.ok) {
                setProfile(data.profile)
                setIsEditing(false)
            }
        } catch (error) {
            console.error('Error saving profile:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    if (!user) return <div>Loading...</div>

    return (
        <div className="flex flex-col items-center p-6 max-w-2xl mx-auto">
            <div className="w-full mb-8">
                <h1 className="text-3xl text-blue-600 mb-4">Profile</h1>
                <div className="flex items-center gap-4 mb-6">
                    <img 
                        src={user.image_url || "/user.jpg"} 
                        alt="avatar" 
                        className="rounded-full w-20 h-20"
                    />
                    <div>
                        <p className="text-2xl font-medium">{user.first_name} {user.last_name}</p>
                        <p className="text-gray-600">@{user.user_name}</p>
                    </div>
                </div>
            </div>

            {!isEditing && profile && (
                <div className="w-full mb-6">
                    {profile.banner_url && (
                        <img 
                            src={profile.banner_url} 
                            alt="Profile banner" 
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                    )}
                    <p className="text-gray-700 whitespace-pre-wrap">{profile.description}</p>
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Edit Profile
                    </button>
                </div>
            )}

            {(isEditing || !profile) && (
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Banner URL</label>
                        <input
                            type="text"
                            name="banner_url"
                            value={formData.banner_url}
                            onChange={handleChange}
                            className="text-black w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="text-black w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {profile ? 'Save Changes' : 'Create Profile'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false)
                                    setFormData(profile!)
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    )
}

export default Profile

// import { useAppSelector } from "../store/hooks"
// import { useEffect, useState } from "react"
// import { NewProfile } from "../types/db"

// const Profile = () => {
//     const [profile, setProfile] = useState({} as NewProfile)
//     const user = useAppSelector((state) => state.user.user)

//     useEffect(() => {
//       try {
//         const fetchProfile = async () => {
//           const response = await fetch('http://localhost:3000/profile', {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//             },
//             credentials: 'include',
//           })

//           const data = await response.json()

//         }


//         const res = await fetchProfile()
//       }
//     })

//     return (
//         <div className="flex flex-col items-center">
//             <h1 className="text-3xl text-blue-600">Profile</h1>
//             {
//                 user && <p className="text-2xl font-regular">Welcome, {user.first_name}</p>
//             }
//             {
//                 user.image_url &&
//                 <img src={user.image_url || "/user.jpg"} alt="avatar" className="rounded-full w-20 h-20" />
//             }
//             <p className="text-2xl font-regular">Welcome to the profile page</p>
//             <pre>{JSON.stringify(user, null, 2)}</pre>
//         </div>
//     )
// }

// export default Profile