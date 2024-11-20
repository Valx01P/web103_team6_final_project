export interface User {
    id: string
    email: string
    user_name: string
    first_name: string
    last_name: string
    image_url?: string
    created_at?: string
    last_login?: string
    last_updated?: string
    failed_login_attempts?: number
}

export interface SignUpData {
    email: string
    password: string
    user_name: string
    first_name: string
    last_name: string
}

export interface SignInData {
    email: string
    password: string
}

/*
ex. new post data

{
    "post": {
        "title": "ex post w tags",
        "content": "dope post"
    },
    "tags": ["bro", "lmao"]
}

*/

export interface NewPostData {
    post: {
        title: string
        content: string
    }
    tags: string[]
}

/*
ex. post data
    "posts": [
        {
            "id": 10,
            "user_id": "fee43ec7-566d-4de7-a32e-4344b54b99a8",
            "title": "ex post w tags",
            "content": "dope post",
            "created_at": "2024-11-20T07:42:27.081Z",
            "score": 0,
            "last_updated": "2024-11-20T07:42:27.081Z",
            "tags": [
                "lmao",
                "bro"
            ]
        },
        {
            "id": 11,
            "user_id": "fee43ec7-566d-4de7-a32e-4344b54b99a8",
            "title": "ayooo",
            "content": "epic post",
            "created_at": "2024-11-20T07:44:16.426Z",
            "score": 0,
            "last_updated": "2024-11-20T07:44:16.426Z",
            "tags": [
                "gyattt"
            ]
        }
    ]
*/

export interface Post {
    id: number
    user_id: string
    title: string
    content: string
    created_at: string
    score: number
    last_updated: string
    tags: string[]
}

export interface Posts {
    posts: Post[]
}