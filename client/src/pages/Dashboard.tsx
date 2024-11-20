import { useState } from "react"

const Dashboard = () => {
  const [closeSidebar, setCloseSidebar] = useState(false)
  const [activeContent, setActiveContent] = useState('posts')

  const handleSidebar = () => {
    setCloseSidebar(!closeSidebar)
  }

  const handleContent = (content: string) => {
    setActiveContent(content)
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
                <h1 className="text-3xl text-white hover:text-blue-300">Layout</h1>
              </>
            )
          }
          <div className="absolute right-0 top-1/2 w-[4px] h-[70px] bg-zinc-100 cursor-pointer" onClick={handleSidebar}></div>
        </div>
      </div>
      {/* Main Content */}
      <div className="bg-zinc-600 min-h-full w-full">
          { activeContent === 'posts' && ( <h1>posts</h1> ) }
          { activeContent === 'tags' && ( <h1>tags</h1> ) }
          { activeContent === 'create' && ( <h1>layout</h1> ) }

      </div>
    </div>
  )
}

export default Dashboard