import PostgresService from '../services/postgresService.js'

const User = new PostgresService('users')

const userController = {
  async getAll(req, res) {
    try {
      const users = await User.get_all()
      
      // Format users to remove sensitive data
      const formattedUsers = users.map(user => ({
        id: user.id,
        user_name: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
        image_url: user.image_url,
        created_at: user.created_at
      }))
      
      return res.status(200).json({
        message: "Users successfully retrieved",
        users: formattedUsers
      })
    } catch (error) {
      console.error('Error getting all users:', error)
      return res.status(500).json({
        message: 'Internal server error while retrieving users'
      })
    }
  },

  async getOne(req, res) {
    try {
      const user = await User.get_by_id(req.params.id)
      
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        })
      }

      // Format user to remove sensitive data
      const formattedUser = {
        id: user.id,
        user_name: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
        image_url: user.image_url,
        created_at: user.created_at
      }
      
      return res.status(200).json({
        message: "User successfully retrieved",
        user: formattedUser
      })
    } catch (error) {
      console.error('Error getting user:', error)
      return res.status(500).json({
        message: 'Internal server error while retrieving user'
      })
    }
  },

  async update(req, res) {
    try {
      // Prevent updating sensitive fields
      const { password, email, ...allowedUpdates } = req.body
      
      const user = await User.update(req.params.id, allowedUpdates)
      
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        })
      }

      // Format response to remove sensitive data
      const formattedUser = {
        id: user.id,
        user_name: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
        image_url: user.image_url,
        created_at: user.created_at,
        last_updated: user.last_updated
      }
      
      return res.status(200).json({
        message: "User successfully updated",
        user: formattedUser
      })
    } catch (error) {
      console.error('Error updating user:', error)
      return res.status(500).json({
        message: 'Internal server error while updating user'
      })
    }
  },

  async delete(req, res) {
    try {
      const user = await User.delete(req.params.id)
      
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        })
      }
      
      // Send 204 with no content for successful deletion
      return res.status(204).send()
    } catch (error) {
      console.error('Error deleting user:', error)
      return res.status(500).json({
        message: 'Internal server error while deleting user'
      })
    }
  }
}

export default userController