import PostgresService from '../services/postgresService.js'

const User = new PostgresService('users')

const userController = {
    // sends an array of all user objects
    async getAll(req, res) {
        try {
            const users = await User.get_all()
            return res.status(200).json({
                message: "Users successfully retrieved",
                data: users
            })
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    // sends a single user object
    async getOne(req, res) {
        try {
            const user = await User.get_by_id(req.params.id)
            return res.status(200).json({
                message: "User successfully retrieved",
                data: user
            })
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    // sends the updated user object
    async update(req, res) {
        try {
            const user = await User.update(req.params.id, req.body)
            return res.status(200).json({
                message: "User successfully updated",
                data: user
            })
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    // sends the deleted user object
    async delete(req, res) {
        try {
            const user = await User.delete(req.params.id)
            return res.status(204).json({
                message: "User successfully deleted",
                data: user
            })
        } catch (error) {
            return res.status(400).send(error)
        }
    }
}

export default userController