import { api } from "../services/api"

const GithubLogin = () => {
    const handleGithubLogin = async () => {
        try {
            const response = await api.auth.getGithubLoginUrl()
            window.location.href = response.url
        } catch (error) {
            console.error('Failed to start GitHub login:', error)
        }
    }

    return (
        <button
            onClick={handleGithubLogin}
            type="button"
            className="flex items-center justify-center w-[250px] bg-gray-500 text-white p-2 hover:bg-gray-700"
        >
            Continue with GitHub
        </button>
    )
}

export default GithubLogin