const verifyUserOwnership = (req, res, next) => {
  try {
      // jwt_user was added by verifyJWT middleware
      if (!req.jwt_user) {
          return res.status(401).json({ message: 'Authentication required' })
      }

      console.log('Token user ID:', req.jwt_user.userId)
      console.log('Requested user ID:', req.params.user_id)

      if (req.jwt_user.userId.toLowerCase() !== req.params.user_id.toLowerCase()) {
        return res.status(403).json({ 
            message: 'Access denied - you can only modify your own account' 
        })
      }

      next()
  } catch (error) {
      console.error('User ownership verification error:', error)
      return res.status(500).json({ 
          message: 'Internal server error during authorization' 
      })
  }
}

export default verifyUserOwnership

