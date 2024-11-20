import { useState, useEffect } from "react"
import { Post, NewPostData } from "../types/db"
import { Menu } from "lucide-react"

const Dashboard = () => {
  const [closeSidebar, setCloseSidebar] = useState(false)
  const [activeContent, setActiveContent] = useState('posts')
  const [posts, setPosts] = useState([] as Post[])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([] as string[])
  const [layoutMenu, setLayoutMenu] = useState(false)
  const [layoutType, setLayoutType] = useState(localStorage.getItem('layout') || 'large')
  const [search, setSearch] = useState('')
  const [filteredPosts, setFilteredPosts] = useState([] as Post[])
  const [filteredTags, setFilteredTags] = useState([] as string[])
  const [filteredBy, setFilteredBy] = useState('most recent')

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const response = await fetch('http://localhost:3000/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          credentials: 'include',
        })
        console.log('RES',response)
        const data = await response.json()
        console.log('DATA',data)
        setPosts(data.posts)
        console.log('POSTS',posts)
      }
      fetchPosts()
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    }
  }, [])

  const handleSidebar = () => {
    setCloseSidebar(!closeSidebar)
  }

  const handleContent = (content: string) => {
    setActiveContent(content)
  }

  const handleLayout = () => {
    setLayoutMenu(!layoutMenu)
  }

  const handleNewPost = async (e: React.FormEvent) => {
    e.preventDefault()
    const newPostData: NewPostData = {
      post: {
        title,
        content,
      },
      tags,
    }
    try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
        body: JSON.stringify(newPostData),
      })
      console.log('RES',response)
      const data = await response.json()
      console.log('DATA',data)
      setPosts([...posts, data.post])
      console.log('POSTS',posts)
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  return (
    <div className="min-h-full flex flex-1">
      {/* Sidebar */}
      <div className={`bg-zinc-800 min-h-full ${closeSidebar ? 'w-[50px]' : 'w-[400px]'} relative`}>
        <div className="flex items-start flex-col p-8 gap-8">
          { closeSidebar
            ? null
            : (
              <>
                { (activeContent === 'posts' || activeContent === 'tags') && <h1 className="text-3xl text-white hover:text-blue-300 cursor-pointer" onClick={() => handleContent('create')}>Create Problem</h1> }
                { (activeContent === 'tags' || activeContent === 'create') && <h1 className="text-3xl text-white hover:text-blue-300 cursor-pointer" onClick={() => handleContent('posts')}>View Posts</h1> }
                { (activeContent === 'posts' || activeContent === 'create') && <h1 className="text-3xl text-white hover:text-blue-300 cursor-pointer" onClick={() => handleContent('tags')}>View Tags</h1> }
                <h1 className="text-3xl text-white hover:text-blue-300 cursor-pointer" onClick={handleLayout}>Layout</h1>
                { layoutMenu && (
                  <div className="flex flex-col gap-4 ml-4">
                    <h1 className="text-2xl text-white hover:text-blue-300 cursor-pointer" onClick={() => { setLayoutType('small'); localStorage.setItem('layout', 'small') }}>⋅ Small</h1>
                    <h1 className="text-2xl text-white hover:text-blue-300 cursor-pointer" onClick={() => { setLayoutType('medium'); localStorage.setItem('layout', 'medium') }}>⋅ Medium</h1>
                    <h1 className="text-2xl text-white hover:text-blue-300 cursor-pointer" onClick={() => { setLayoutType('large'); localStorage.setItem('layout', 'large') }}>⋅ Large</h1>
                  </div>
                )  
                }
              </>
            )
          }
          <div className="absolute right-0 top-1/2 w-[4px] h-[70px] bg-zinc-100 cursor-pointer" onClick={handleSidebar}></div>
        </div>
      </div>
      {/* Main Content */}
      <div className="bg-zinc-600 min-h-full w-full">
          { activeContent === 'posts' && ( <div className="h-full w-full">
            <div className="m-4 relative max-w-fit">
              <input type="text" placeholder="Search" className="text-black rounded-lg border border-gray-400 p-2 flex w-[300px]"/>
              <Menu size={26} className="absolute top-2 right-4 text-zinc-700 cursor-pointer" />
            </div>
            <div className={`overflow-auto h-[750px] ${layoutType === 'small' && ('grid grid-cols-4')} ${layoutType === 'medium' && ('grid grid-cols-2')}`}>
              {
                posts.map((post: Post) => (
                  <div key={post.id} className={`bg-zinc-800 p-4 m-4 rounded-lg ${layoutType === 'large' && ('h-[150px]')} `}>
                    <h1 className="text-2xl text-white">{post.title}</h1>
                    <p className="text-white">{post.content}</p>
                  </div>
                ))
              }
            </div>
          </div> ) }
          { activeContent === 'tags' && ( <div>
            <h1>tags</h1>
          </div> ) }
          { activeContent === 'create' && ( <div className="text-black w-full min-h-full flex align-middle justify-center items-center ">
            <form onSubmit={handleNewPost} className="p-8 bg-zinc-800 w-[400px] flex flex-col gap-4">
              <label className="text-white text-xl">Create Post</label>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-400 p-2 w-full"
              />
              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border border-gray-400 p-2 w-full"
              />
              <input
                type="text"
                placeholder="Tags"
                value={tags}
                onChange={(e) => setTags(e.target.value.split(','))}
                className="border border-gray-400 p-2 w-full"
              />
              <button type="submit" className="bg-blue-600 text-white p-2">Create Post</button>
            </form>
          </div> ) }

      </div>
    </div>
  )
}

export default Dashboard