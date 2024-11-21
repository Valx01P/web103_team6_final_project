import { useState, useEffect } from "react"
import { Menu, MoreVertical, ArrowUp, ArrowDown, X, Edit, Trash2, Reply } from "lucide-react"
import { useAppSelector } from "../store/hooks"

interface Post {
    id: number
    user_id: string
    title: string
    content: string
    created_at: string
    score: number
    last_updated: string
    tags: string[]
}

interface Comment {
    id: number
    user_id: string
    post_id?: number
    parent_comment_id?: number
    content: string
    score: number
    created_at: string
    last_updated: string
}

const Dashboard = () => {
  const [closeSidebar, setCloseSidebar] = useState(false)
  const [activeContent, setActiveContent] = useState('posts')
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [layoutMenu, setLayoutMenu] = useState(false)
  const [layoutType, setLayoutType] = useState(localStorage.getItem('layout') || 'large')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [filterBy, setFilterBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [showPostMenu, setShowPostMenu] = useState<number | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentContent, setCommentContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({})
  const [editingComment, setEditingComment] = useState<number | null>(null)
  const [editPostTitle, setEditPostTitle] = useState('')
  const [editPostContent, setEditPostContent] = useState('')
  const [editPostTags, setEditPostTags] = useState<string[]>([])

  const user = useAppSelector((state) => state.user.user)

  const handleNewComment = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!selectedPost || !commentContent.trim()) return

      try {
          const response = await fetch('http://localhost:3000/comments', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
              },
              credentials: 'include',
              body: JSON.stringify({
                  post_id: selectedPost.id,
                  content: commentContent.trim()
              })
          })
          const data = await response.json()
          if (response.ok) {
              setComments([...comments, data.comment])
              setCommentContent('')
          }
      } catch (error) {
          console.error('Failed to create comment:', error)
      }
  }

    useEffect(() => {
        if (user) {
            fetchPosts()
            fetchUserVotes()
        }
    }, [user])

    useEffect(() => {
        if (selectedPost) {
            fetchComments(selectedPost.id)
        }
    }, [selectedPost])

    useEffect(() => {
        if (editingPost) {
            setEditPostTitle(editingPost.title)
            setEditPostContent(editingPost.content)
            setEditPostTags(editingPost.tags)
        }
    }, [editingPost])

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:3000/posts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: 'include',
            })
            const data = await response.json()
            if (response.ok) {
                setPosts(data.posts)
                const tags = [...new Set(data.posts.flatMap(post => post.tags))]
                setAllTags(tags)
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error)
        }
    }

    const handleNewPost = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:3000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    post: { title, content },
                    tags
                }),
            })
            const data = await response.json()
            if (response.ok) {
                setPosts([data.post, ...posts])
                setTitle('')
                setContent('')
                setTags([])
                setActiveContent('posts')
            }
        } catch (error) {
            console.error('Failed to create post:', error)
        }
    }

    const handleEditPost = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingPost) return

        try {
            const response = await fetch(`http://localhost:3000/posts/${editingPost.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    post: { 
                        title: editPostTitle,
                        content: editPostContent 
                    },
                    tags: editPostTags
                })
            })
            if (response.ok) {
                const updatedPost = {
                    ...editingPost,
                    title: editPostTitle,
                    content: editPostContent,
                    tags: editPostTags
                }
                setPosts(posts.map(p => p.id === editingPost.id ? updatedPost : p))
                if (selectedPost?.id === editingPost.id) {
                    setSelectedPost(updatedPost)
                }
                setEditingPost(null)
                setShowPostMenu(null)
            }
        } catch (error) {
            console.error('Failed to update post:', error)
        }
    }

    const handleDeletePost = async (postId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: 'include',
            })
            if (response.ok) {
                setPosts(posts.filter(p => p.id !== postId))
                if (selectedPost?.id === postId) {
                    setSelectedPost(null)
                }
                setShowPostMenu(null)
            }
        } catch (error) {
            console.error('Failed to delete post:', error)
        }
    }
    const fetchComments = async (postId: number) => {
      try {
          const response = await fetch('http://localhost:3000/comments', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
              },
              credentials: 'include',
              body: JSON.stringify({ post_id: postId })
          })
          const data = await response.json()
          if (response.ok) {
              setComments(data.comments)
          }
      } catch (error) {
          console.error('Failed to fetch comments:', error)
      }
  }



  const fetchUserVotes = async () => {
    try {
        // Change to match your backend route for getting all votes
        const response = await fetch('http://localhost:3000/votes/all', {  // Or whatever your actual endpoint is
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
            credentials: 'include',
        })
        
        if (!response.ok) {
            console.log('Could not fetch votes, continuing without vote data')
            return // Don't reset votes if fetch fails
        }
        
        const data = await response.json()
        if (data.votes) {
            const votesMap: Record<string, boolean> = {}
            data.votes.forEach(vote => {
                if (vote.post_id) votesMap[`post_${vote.post_id}`] = vote.positive
                if (vote.comment_id) votesMap[`comment_${vote.comment_id}`] = vote.positive
            })
            console.log('Loaded votes:', votesMap)
            setUserVotes(votesMap)
        }
    } catch (error) {
        console.error('Failed to fetch votes:', error)
        // Don't reset votes on error
    }
}

const handleVote = async (type: 'post' | 'comment', id: number, positive: boolean) => {
    console.log('Vote clicked:', { type, id, positive })
    const voteKey = `${type}_${id}`
    const currentVote = userVotes[voteKey]
    
    // If already voted this way, don't do anything
    if (currentVote === positive) {
        console.log('Already voted this way')
        return
    }

    // Calculate score change
    let scoreChange = 1
    if (currentVote !== undefined) {
        scoreChange = 2 // When changing vote direction
    }
    if (!positive) scoreChange = -scoreChange

    // Keep track of previous state for rollback
    const previousVotes = { ...userVotes }
    const previousPosts = [...posts]
    const previousComments = [...comments]
    const previousSelectedPost = selectedPost ? { ...selectedPost } : null

    try {
        // Optimistic update
        if (type === 'post') {
            setPosts(prevPosts => 
                prevPosts.map(p => p.id === id 
                    ? { ...p, score: p.score + scoreChange }
                    : p
                )
            )
            if (selectedPost?.id === id) {
                setSelectedPost(prev => 
                    prev ? { ...prev, score: prev.score + scoreChange } : null
                )
            }
        } else {
            setComments(prevComments => 
                prevComments.map(c => c.id === id 
                    ? { ...c, score: c.score + scoreChange }
                    : c
                )
            )
        }

        // Update local vote state
        setUserVotes(prev => ({
            ...prev,
            [voteKey]: positive
        }))

        // Make API call
        const method = currentVote !== undefined ? 'PUT' : 'POST'
        const response = await fetch('http://localhost:3000/votes', {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
            credentials: 'include',
            body: JSON.stringify({ 
                [`${type}_id`]: id, 
                positive 
            })
        })

        if (!response.ok) {
            // Rollback on error
            setPosts(previousPosts)
            setComments(previousComments)
            setSelectedPost(previousSelectedPost)
            setUserVotes(previousVotes)
            
            const errorData = await response.json()
            console.error('Vote failed:', errorData.message)
            return
        }

        const data = await response.json()
        console.log('Vote successful:', data)
        
        // Update with server data
        if (type === 'post' && data.post) {
            setPosts(prevPosts => 
                prevPosts.map(p => p.id === id 
                    ? { ...p, score: data.post.score }
                    : p
                )
            )
            if (selectedPost?.id === id) {
                setSelectedPost(prev => 
                    prev ? { ...prev, score: data.post.score } : null
                )
            }
        } else if (type === 'comment' && data.comment) {
            setComments(prevComments => 
                prevComments.map(c => c.id === id 
                    ? { ...c, score: data.comment.score }
                    : c
                )
            )
        }
    } catch (error) {
        // Rollback on error
        setPosts(previousPosts)
        setComments(previousComments)
        setSelectedPost(previousSelectedPost)
        setUserVotes(previousVotes)
        
        console.error('Failed to vote:', error)
    }
}

  const handleDeleteComment = async (commentId: number) => {
      try {
          const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
              },
              credentials: 'include',
          })
          if (response.ok) {
              setComments(comments.filter(c => c.id !== commentId))
          }
      } catch (error) {
          console.error('Failed to delete comment:', error)
      }
  }
  const handleUpdateComment = async (commentId: number, newContent: string) => {
    try {
        const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
            credentials: 'include',
            body: JSON.stringify({ content: newContent.trim() })
        })
        const data = await response.json()
        if (response.ok) {
            setComments(comments.map(c => c.id === commentId ? data.comment : c))
            setEditingComment(null)
        }
    } catch (error) {
        console.error('Failed to update comment:', error)
    }
}

const getFilteredPosts = () => {
    let filtered = [...posts]

    if (searchTerm) {
        filtered = filtered.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    if (selectedTags.length > 0) {
        filtered = filtered.filter(post =>
            selectedTags.every(tag => post.tags.includes(tag))
        )
    }

    switch (filterBy) {
        case 'newest':
            filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            break
        case 'oldest':
            filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            break
        case 'popular':
            filtered.sort((a, b) => b.score - a.score)
            break
        case 'unpopular':
            filtered.sort((a, b) => a.score - b.score)
            break
    }

    return filtered
}

const CommentThread = ({ comment, depth = 0 }) => {
  const childComments = comments.filter(c => c.parent_comment_id === comment.id)
  const isOwner = comment.user_id === user.id
  const [editContent, setEditContent] = useState(comment.content)

    return (
        <div className={`border-l-2 border-zinc-700 ${depth > 0 ? 'ml-4' : ''}`}>
            <div className="pl-4 py-2">
                <div className="bg-zinc-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                        {editingComment === comment.id ? (
                            <div className="flex-1 space-y-2">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full p-2 bg-zinc-700 text-white rounded"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdateComment(comment.id, editContent)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingComment(null)}
                                        className="px-3 py-1 bg-zinc-600 text-white rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-zinc-300 flex-1">{comment.content}</p>
                        )}
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                <ArrowUp
                                    className={`cursor-pointer ${
                                        userVotes[`comment_${comment.id}`] === true ? 'text-blue-500' : 'text-white'
                                    }`}
                                    onClick={() => handleVote('comment', comment.id, true)}
                                />
                                <span className="text-white">{comment.score}</span>
                                <ArrowDown
                                    className={`cursor-pointer ${
                                        userVotes[`comment_${comment.id}`] === false ? 'text-red-500' : 'text-white'
                                    }`}
                                    onClick={() => handleVote('comment', comment.id, false)}
                                />
                            </div>
                            {isOwner && (
                                <div className="relative">
                                    <MoreVertical
                                        className="text-white cursor-pointer hover:text-zinc-400"
                                        onClick={() => setEditingComment(editingComment === comment.id ? null : comment.id)}
                                    />
                                    <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-zinc-700 ring-1 ring-black ring-opacity-5 ${editingComment === comment.id ? '' : 'hidden'}`}>
                                        <div className="py-1">
                                            <button
                                                className="w-full px-4 py-2 text-sm text-white hover:bg-zinc-600 flex items-center gap-2"
                                                onClick={() => setEditingComment(comment.id)}
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </button>
                                            <button
                                                className="w-full px-4 py-2 text-sm text-white hover:bg-zinc-600 flex items-center gap-2"
                                                onClick={() => handleDeleteComment(comment.id)}
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <Reply
                                className="text-white cursor-pointer hover:text-blue-300"
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            />
                        </div>
                    </div>

                    {replyingTo === comment.id && (
                        <div className="mt-4">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="w-full p-2 bg-zinc-700 text-white rounded"
                                placeholder="Write a reply..."
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleReply(comment.id)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Reply
                                </button>
                                <button
                                    onClick={() => {
                                        setReplyingTo(null)
                                        setReplyContent('')
                                    }}
                                    className="px-3 py-1 bg-zinc-600 text-white rounded hover:bg-zinc-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {childComments.length > 0 && (
                <div>
                    {childComments.map(childComment => (
                        <CommentThread
                            key={childComment.id}
                            comment={childComment}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
return (
  <div className="min-h-full flex flex-1">
      {/* Sidebar */}
      <div className={`bg-zinc-800 min-h-full ${closeSidebar ? 'w-[50px]' : 'w-[400px]'} relative`}>
          <div className="flex items-start flex-col p-8 gap-8">
              {!closeSidebar && (
                  <>
                      {(activeContent === 'posts' || activeContent === 'tags') && 
                          <h1 className="text-3xl text-white hover:text-blue-300 cursor-pointer" 
                              onClick={() => setActiveContent('create')}>
                              Create Problem
                          </h1>
                      }
                      {(activeContent === 'tags' || activeContent === 'create') && 
                          <h1 className="text-3xl text-white hover:text-blue-300 cursor-pointer" 
                              onClick={() => setActiveContent('posts')}>
                              View Posts
                          </h1>
                      }
                      {(activeContent === 'posts' || activeContent === 'create') && 
                          <h1 className="text-3xl text-white hover:text-blue-300 cursor-pointer" 
                              onClick={() => setActiveContent('tags')}>
                              View Tags
                          </h1>
                      }
                      <h1 className="text-3xl text-white hover:text-blue-300 cursor-pointer" 
                          onClick={() => setLayoutMenu(!layoutMenu)}>
                          Layout
                      </h1>
                      {layoutMenu && (
                          <div className="flex flex-col gap-4 ml-4">
                              {['small', 'medium', 'large'].map(size => (
                                  <h1 key={size}
                                      className="text-2xl text-white hover:text-blue-300 cursor-pointer" 
                                      onClick={() => { 
                                          setLayoutType(size)
                                          localStorage.setItem('layout', size)
                                          setLayoutMenu(false)
                                      }}>
                                      ⋅ {size.charAt(0).toUpperCase() + size.slice(1)}
                                  </h1>
                              ))}
                          </div>
                      )}
                  </>
              )}
              <div className="absolute right-0 top-1/2 w-[4px] h-[70px] bg-zinc-100 cursor-pointer" 
                   onClick={() => setCloseSidebar(!closeSidebar)}
              />
          </div>
      </div>

      {/* Main Content */}
      <div className="bg-zinc-600 min-h-full w-full">
          {activeContent === 'posts' && (
              <div className="h-full w-full">
                  {/* Search and Filter Bar */}
                  <div className="p-4 flex justify-between items-center">
                      <div className="relative">
                          <input 
                              type="text"
                              placeholder="Search"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="text-black rounded-lg border border-gray-400 p-2 w-[300px]"
                          />
                          <Menu 
                              size={26} 
                              className="absolute right-2 top-2 text-zinc-700 cursor-pointer"
                              onClick={() => setShowFilters(!showFilters)}
                          />
                      </div>
                      {showFilters && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                               onClick={() => setShowFilters(false)}>
                              <div className="bg-zinc-800 p-6 rounded-lg max-w-md w-full mx-4"
                                   onClick={e => e.stopPropagation()}>
                                  <div className="mb-6">
                                      <h3 className="text-white text-lg mb-4">Filter Posts</h3>
                                      <div className="space-y-4">
                                          <div>
                                              <h4 className="text-white mb-2">Tags</h4>
                                              <div className="flex flex-wrap gap-2">
                                                  {allTags.map(tag => (
                                                      <button
                                                          key={tag}
                                                          onClick={() => setSelectedTags(
                                                              selectedTags.includes(tag)
                                                                  ? selectedTags.filter(t => t !== tag)
                                                                  : [...selectedTags, tag]
                                                          )}
                                                          className={`px-2 py-1 rounded ${
                                                              selectedTags.includes(tag)
                                                                  ? 'bg-blue-600 text-white'
                                                                  : 'bg-gray-600 text-gray-200'
                                                          }`}
                                                      >
                                                          {tag}
                                                      </button>
                                                  ))}
                                              </div>
                                          </div>
                                          <div>
                                              <h4 className="text-white mb-2">Sort by</h4>
                                              <div className="grid grid-cols-2 gap-2">
                                                  {['newest', 'oldest', 'popular', 'unpopular'].map(filter => (
                                                      <button
                                                          key={filter}
                                                          onClick={() => setFilterBy(filter)}
                                                          className={`px-2 py-1 rounded ${
                                                              filterBy === filter
                                                                  ? 'bg-blue-600 text-white'
                                                                  : 'bg-gray-600 text-gray-200'
                                                          }`}
                                                      >
                                                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                                      </button>
                                                  ))}
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Posts Grid */}
                  <div className={`overflow-auto h-[750px] ${
                      layoutType === 'small' ? 'grid grid-cols-4' :
                      layoutType === 'medium' ? 'grid grid-cols-2' : ''
                  }`}>
                      {getFilteredPosts().map((post) => (
                          <div key={post.id} 
                               className={`bg-zinc-800 p-4 m-4 rounded-lg ${
                                   layoutType === 'large' ? 'h-[150px]' : ''
                               }`}>
                              <div className="flex justify-between items-start">
                                  <div className="flex-1 cursor-pointer" onClick={() => setSelectedPost(post)}>
                                      <h1 className="text-2xl text-white">{post.title}</h1>
                                      <p className="text-white">{post.content}</p>
                                      {post.tags.length > 0 && (
                                          <div className="flex flex-wrap gap-2 mt-4">
                                              {post.tags.map(tag => (
                                                  <span key={tag} 
                                                        className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-lg text-sm">
                                                      {tag}
                                                  </span>
                                              ))}
                                          </div>
                                      )}
                                  </div>
                                  <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
                                      <div className="flex flex-col items-center">
                                        <div className="flex flex-col items-center">
                                          <ArrowUp
                                              className={`cursor-pointer hover:text-blue-300 ${
                                                  userVotes[`post_${post.id}`] === true ? 'text-blue-500' : 'text-white'
                                              }`}
                                              onClick={(e) => {
                                                  e.stopPropagation()
                                                  console.log('Upvote clicked for post:', post.id)
                                                  handleVote('post', post.id, true)
                                              }}
                                          />
                                          <span className="text-white">{post.score}</span>
                                          <ArrowDown
                                              className={`cursor-pointer hover:text-red-300 ${
                                                  userVotes[`post_${post.id}`] === false ? 'text-red-500' : 'text-white'
                                              }`}
                                              onClick={(e) => {
                                                  e.stopPropagation()
                                                  console.log('Downvote clicked for post:', post.id)
                                                  handleVote('post', post.id, false)
                                              }}
                                          />
                                        </div>
                                      </div>
                                      {post.user_id === user.id && (
                                          <div className="relative">
                                              <MoreVertical
                                                  className="text-white cursor-pointer hover:text-zinc-400"
                                                  onClick={() => setShowPostMenu(showPostMenu === post.id ? null : post.id)}
                                              />
                                              {showPostMenu === post.id && (
                                                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-zinc-700 ring-1 ring-black ring-opacity-5">
                                                      <div className="py-1">
                                                          <button
                                                              className="w-full px-4 py-2 text-sm text-white hover:bg-zinc-600 flex items-center gap-2"
                                                              onClick={() => setEditingPost(post)}
                                                          >
                                                              <Edit size={16} />
                                                              Edit
                                                          </button>
                                                          <button
                                                              className="w-full px-4 py-2 text-sm text-white hover:bg-zinc-600 flex items-center gap-2"
                                                              onClick={() => handleDeletePost(post.id)}
                                                          >
                                                              <Trash2 size={16} />
                                                              Delete
                                                          </button>
                                                      </div>
                                                  </div>
                                              )}
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Edit Post Modal */}
                  {editingPost && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                          <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-md">
                              <h2 className="text-xl text-white mb-4">Edit Post</h2>
                              <form onSubmit={handleEditPost} className="space-y-4">
                                  <input
                                      type="text"
                                      value={editPostTitle}
                                      onChange={(e) => setEditPostTitle(e.target.value)}
                                      className="w-full p-2 bg-zinc-700 text-white rounded"
                                      placeholder="Title"
                                  />
                                  <textarea
                                      value={editPostContent}
                                      onChange={(e) => setEditPostContent(e.target.value)}
                                      className="w-full p-2 bg-zinc-700 text-white rounded"
                                      placeholder="Content"
                                      rows={4}
                                  />
                                  <input
                                      type="text"
                                      value={editPostTags.join(',')}
                                      onChange={(e) => setEditPostTags(e.target.value.split(',').map(tag => tag.trim()))}
                                      className="w-full p-2 bg-zinc-700 text-white rounded"
                                      placeholder="Tags (comma-separated)"
                                  />
                                  <div className="flex justify-end gap-2">
                                      <button
                                          type="button"
                                          onClick={() => {
                                              setEditingPost(null)
                                              setShowPostMenu(null)
                                          }}
                                          className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-700"
                                      >
                                          Cancel
                                      </button>
                                      <button
                                          type="submit"
                                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                      >
                                          Save
                                      </button>
                                  </div>
                              </form>
                          </div>
                      </div>
                  )}

                  {/* Selected Post Modal */}
                  {selectedPost && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                           onClick={() => setSelectedPost(null)}>
                          <div className="bg-zinc-900 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                               onClick={e => e.stopPropagation()}>
                              <div className="sticky top-0 bg-zinc-900 p-6 border-b border-zinc-700">
                                  <div className="flex justify-between items-start">
                                      <div>
                                          <h2 className="text-2xl text-white">{selectedPost.title}</h2>
                                          <p className="text-zinc-300 mt-4">{selectedPost.content}</p>
                                          {selectedPost.tags.length > 0 && (
                                              <div className="flex flex-wrap gap-2 mt-4">
                                                  {selectedPost.tags.map(tag => (
                                                      <span key={tag} 
                                                            className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-lg text-sm">
                                                          {tag}
                                                      </span>
                                                  ))}
                                              </div>
                                          )}
                                      </div>
                                      <div className="flex items-center gap-4">
                                          <div className="flex flex-col items-center">
                                              <ArrowUp
                                                  className={`cursor-pointer ${
                                                      userVotes[`post_${selectedPost.id}`] === true 
                                                          ? 'text-blue-500' 
                                                          : 'text-white'
                                                  }`}
                                                  onClick={() => handleVote('post', selectedPost.id, true)}
                                              />
                                              <span className="text-white">{selectedPost.score}</span>
                                              <ArrowDown
                                                  className={`cursor-pointer ${
                                                      userVotes[`post_${selectedPost.id}`] === false 
                                                          ? 'text-red-500' 
                                                          : 'text-white'
                                                  }`}
                                                  onClick={() => handleVote('post', selectedPost.id, false)}
                                              />
                                          </div>
                                          {selectedPost.user_id === user.id && (
                                              <div className="relative">
                                                  <MoreVertical
                                                      className="text-white cursor-pointer hover:text-zinc-400"
                                                      onClick={() => setShowPostMenu(showPostMenu === selectedPost.id ? null : selectedPost.id)}
                                                        />
                                                        {showPostMenu === selectedPost.id && (
                                                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-zinc-700 ring-1 ring-black ring-opacity-5">
                                                                <div className="py-1">
                                                                    <button
                                                                        className="w-full px-4 py-2 text-sm text-white hover:bg-zinc-600 flex items-center gap-2"
                                                                        onClick={() => setEditingPost(selectedPost)}
                                                                    >
                                                                        <Edit size={16} />
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className="w-full px-4 py-2 text-sm text-white hover:bg-zinc-600 flex items-center gap-2"
                                                                        onClick={() => handleDeletePost(selectedPost.id)}
                                                                    >
                                                                        <Trash2 size={16} />
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <X
                                                    className="text-white cursor-pointer hover:text-zinc-400"
                                                    onClick={() => setSelectedPost(null)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comments Section */}
                                    <div className="p-6">
                                        <form onSubmit={handleNewComment} className="mb-6">
                                            <textarea
                                                value={commentContent}
                                                onChange={(e) => setCommentContent(e.target.value)}
                                                placeholder="Add a comment..."
                                                className="w-full p-2 bg-zinc-800 text-white rounded-lg border border-zinc-700"
                                                rows={3}
                                            />
                                            <button
                                                type="submit"
                                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Comment
                                            </button>
                                        </form>

                                        <div className="space-y-4">
                                            {comments
                                                .filter(comment => !comment.parent_comment_id)
                                                .map(comment => (
                                                    <CommentThread
                                                        key={comment.id}
                                                        comment={comment}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeContent === 'tags' && (
                    <div>
                        <div className={`overflow-auto h-[750px] ${
                            layoutType === 'small' ? 'grid grid-cols-6' :
                            layoutType === 'medium' ? 'grid grid-cols-2' : ''
                        }`}>
                            {allTags.map((tag) => (
                                <div key={tag} 
                                     className={`bg-zinc-800 p-4 m-4 rounded-lg ${
                                         layoutType === 'large' ? 'h-[80px]' : ''
                                     }`}
                                     onClick={() => {
                                         setSelectedTags([tag])
                                         setActiveContent('posts')
                                     }}>
                                    <h1 className="text-2xl text-white">{tag}</h1>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeContent === 'create' && (
                    <div className="text-black w-full min-h-full flex align-middle justify-center items-center">
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
                                rows={4}
                            />
                            <input
                                type="text"
                                placeholder="Tags (comma-separated)"
                                value={tags.join(',')}
                                onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
                                className="border border-gray-400 p-2 w-full"
                            />
                            <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                                Create Post
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard

// import { useState, useEffect } from "react"
// import { Post, NewPostData } from "../types/db"
// import { useAppSelector } from "../store/hooks"
// import { Menu } from "lucide-react"

// const Dashboard = () => {
//   const [closeSidebar, setCloseSidebar] = useState(false)
//   const [activeContent, setActiveContent] = useState('posts')
//   const [posts, setPosts] = useState([] as Post[])
//   const [title, setTitle] = useState('')
//   const [content, setContent] = useState('')
//   const [allTags, setAllTags] = useState([] as string[])
//   const [tags, setTags] = useState([] as string[])
//   const [layoutMenu, setLayoutMenu] = useState(false)
//   const [layoutType, setLayoutType] = useState(localStorage.getItem('layout') || 'large')
  
  
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedTags, setSelectedTags] = useState([] as string[])
//   const [filterBy, setFilterBy] = useState('newest')
//   const [showFilters, setShowFilters] = useState(false)

//   const [userVotes, setUserVotes] = useState({})
//   const [comments, setComments] = useState([])
//   const [commentContent, setCommentContent] = useState('')

//   const [selectedPost, setSelectedPost] = useState<Post | null>(null)
//   const user = useAppSelector((state) => state.user.user)

//   useEffect(() => {
//     fetchPosts()
//     fetchUserVotes()
//   }, [])

//   useEffect(() => {
//     if (selectedPost) {
//       fetchComments(selectedPost.id)
//     }
//   }, [selectedPost])

//   const fetchPosts = async () => {
//     try {
//     const response = await fetch('http://localhost:3000/posts', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//       },
//       credentials: 'include',
//     })

//     const data = await response.json()
//     setPosts(data.posts)

//     const tags = [...new Set(data.posts.flatMap(post => post.tags))]
//     setAllTags(tags)
//     } catch (error) {
//       console.error('Failed to fetch posts:', error)
//     }
//   }

//   const fetchComments = async (postId: number) => {
//     try {
//       const response = await fetch('http://localhost:3000/comments', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//         },
//         credentials: 'include',
//         body: JSON.stringify({ post_id: postId })
//       })
//       const data = await response.json()
//       setComments(data.comments)
//     } catch (error) {
//       console.error('Failed to fetch comments:', error)
//     }
//   }

//   const fetchUserVotes = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/votes', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//         },
//         credentials: 'include',
//       })
//       const data = await response.json()
//       const votesMap = {}
//       data.votes.forEach(vote => {
//         if (vote.post_id) {
//           votesMap[`post_${vote.post_id}`] = vote.positive
//         } else if (vote.comment_id) {
//           votesMap[`comment_${vote.comment_id}`] = vote.positive
//         }
//       })
//       setUserVotes(votesMap)
//     } catch (error) {
//       console.error('Failed to fetch votes:', error)
//     }
//   }


//   const handleSidebar = () => {
//     setCloseSidebar(!closeSidebar)
//   }

//   const handleContent = (content: string) => {
//     setActiveContent(content)
//   }

//   const handleLayout = () => {
//     setLayoutMenu(!layoutMenu)
//   }

//   const handleNewPost = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const newPostData: NewPostData = {
//       post: {
//         title,
//         content,
//       },
//       tags: tags,
//     }
//     try {
//       const response = await fetch('http://localhost:3000/posts', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//         },
//         credentials: 'include',
//         body: JSON.stringify(newPostData),
//       })
//       console.log('RES',response)
//       const data = await response.json()
//       console.log('DATA',data)
//       setPosts([...posts, data.post])
//       console.log('POSTS',posts)
//     } catch (error) {
//       console.error('Failed to create post:', error)
//     }
//   }

//   const getFilteredPosts = () => {
//     let filtered = [...posts]

//     // Filter by search term
//     if (searchTerm) {
//       filtered = filtered.filter(post => 
//         post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         post.content.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     }

//     // Filter by selected tags
//     if (selectedTags.length > 0) {
//       filtered = filtered.filter(post =>
//         selectedTags.every(tag => post.tags.includes(tag))
//       )
//     }

//     // Sort based on filter
//     switch (filterBy) {
//       case 'newest':
//         filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
//         break
//       case 'oldest':
//         filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
//         break
//       case 'popular':
//         filtered.sort((a, b) => b.score - a.score)
//         break
//       case 'unpopular':
//         filtered.sort((a, b) => a.score - b.score)
//         break
//     }

//     return filtered
//   }

//   return (
//     <div className="min-h-full flex flex-1">
//       {/* Sidebar */}
//       <div className={`bg-zinc-800 min-h-full ${closeSidebar ? 'w-[50px]' : 'w-[400px]'} relative`}>
//         <div className="flex items-start flex-col p-8 gap-8">
//           { closeSidebar
//             ? null
//             : (
//               <>
//                 { (activeContent === 'posts' || activeContent === 'tags') && <h1 className="text-3xl text-white hover:text-blue-300 cursor-pointer" onClick={() => handleContent('create')}>Create Problem</h1> }
//                 { (activeContent === 'tags' || activeContent === 'create') && <h1 className="text-3xl text-white hover:text-blue-300 cursor-pointer" onClick={() => handleContent('posts')}>View Posts</h1> }
//                 { (activeContent === 'posts' || activeContent === 'create') && <h1 className="text-3xl text-white hover:text-blue-300 cursor-pointer" onClick={() => handleContent('tags')}>View Tags</h1> }
//                 <h1 className="text-3xl text-white hover:text-blue-300 cursor-pointer" onClick={handleLayout}>Layout</h1>
//                 { layoutMenu && (
//                   <div className="flex flex-col gap-4 ml-4">
//                     <h1 className="text-2xl text-white hover:text-blue-300 cursor-pointer" onClick={() => { setLayoutType('small'); localStorage.setItem('layout', 'small') }}>⋅ Small</h1>
//                     <h1 className="text-2xl text-white hover:text-blue-300 cursor-pointer" onClick={() => { setLayoutType('medium'); localStorage.setItem('layout', 'medium') }}>⋅ Medium</h1>
//                     <h1 className="text-2xl text-white hover:text-blue-300 cursor-pointer" onClick={() => { setLayoutType('large'); localStorage.setItem('layout', 'large') }}>⋅ Large</h1>
//                   </div>
//                 )  
//                 }
//               </>
//             )
//           }
//           <div className="absolute right-0 top-1/2 w-[4px] h-[70px] bg-zinc-100 cursor-pointer" onClick={handleSidebar}></div>
//         </div>
//       </div>
//       {/* Main Content */}
//       <div className="bg-zinc-600 min-h-full w-full">
//           { activeContent === 'posts' && ( <div className="h-full w-full">
//             <div className="p-4 flex justify-between items-center">
//               <div className="relative">
//                 <input 
//                   type="text"
//                   placeholder="Search"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="text-black rounded-lg border border-gray-400 p-2 w-[300px]"
//                 />
//                 <Menu 
//                   size={26} 
//                   className="absolute right-2 top-2 text-zinc-700 cursor-pointer"
//                   onClick={() => setShowFilters(!showFilters)}
//                 />
//               </div>
//               {showFilters && (
//                 <div className="absolute top-16 left-4 bg-zinc-800 p-4 rounded-lg z-10">
//                   <div className="mb-4">
//                     <h3 className="text-white mb-2">Tags</h3>
//                     <div className="flex flex-wrap gap-2">
//                       {allTags.map(tag => (
//                         <button
//                           key={tag}
//                           onClick={() => setSelectedTags(
//                             selectedTags.includes(tag)
//                               ? selectedTags.filter(t => t !== tag)
//                               : [...selectedTags, tag]
//                           )}
//                           className={`px-2 py-1 rounded ${
//                             selectedTags.includes(tag)
//                               ? 'bg-blue-600 text-white'
//                               : 'bg-gray-600 text-gray-200'
//                           }`}
//                         >
//                           {tag}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="text-white mb-2">Sort by</h3>
//                     <div className="grid grid-cols-2 gap-2">
//                       {['newest', 'oldest', 'popular', 'unpopular'].map(filter => (
//                         <button
//                           key={filter}
//                           onClick={() => setFilterBy(filter)}
//                           className={`px-2 py-1 rounded ${
//                             filterBy === filter
//                               ? 'bg-blue-600 text-white'
//                               : 'bg-gray-600 text-gray-200'
//                           }`}
//                         >
//                           {filter.charAt(0).toUpperCase() + filter.slice(1)}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className={`overflow-auto h-[750px] ${layoutType === 'small' && ('grid grid-cols-4')} ${layoutType === 'medium' && ('grid grid-cols-2')}`}>
//               {
//                 posts.map((post: Post) => (
//                   <div key={post.id} className={`bg-zinc-800 p-4 m-4 rounded-lg ${layoutType === 'large' && ('h-[150px]')} `}>
//                     <h1 className="text-2xl text-white">{post.title}</h1>
//                     <p className="text-white">{post.content}</p>
//                   </div>
//                 ))
//               }
//             </div>
//           </div> ) }
//           { activeContent === 'tags' && ( <div>
//             <div className={`overflow-auto h-[750px] ${layoutType === 'small' && ('grid grid-cols-6')} ${layoutType === 'medium' && ('grid grid-cols-2')}`}>
//               {
//                 allTags.map((tag) => (
//                   <div key={tag} className={`bg-zinc-800 p-4 m-4 rounded-lg ${layoutType === 'large' && ('h-[80px]')} `}>
//                     <h1 className="text-2xl text-white">{tag}</h1>
//                   </div>
//                 ))
//               }
//             </div>
//           </div> ) }
//           { activeContent === 'create' && ( <div className="text-black w-full min-h-full flex align-middle justify-center items-center ">
//             <form onSubmit={handleNewPost} className="p-8 bg-zinc-800 w-[400px] flex flex-col gap-4">
//               <label className="text-white text-xl">Create Post</label>
//               <input
//                 type="text"
//                 placeholder="Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="border border-gray-400 p-2 w-full"
//               />
//               <textarea
//                 placeholder="Content"
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 className="border border-gray-400 p-2 w-full"
//               />
//               <input
//                 type="text"
//                 placeholder="Tags"
//                 value={tags}
//                 onChange={(e) => setTags(e.target.value.split(','))}
//                 className="border border-gray-400 p-2 w-full"
//               />
//               <button type="submit" className="bg-blue-600 text-white p-2">Create Post</button>
//             </form>
//           </div> ) }

//       </div>
//     </div>
//   )
// }

// export default Dashboard