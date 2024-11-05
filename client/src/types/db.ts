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