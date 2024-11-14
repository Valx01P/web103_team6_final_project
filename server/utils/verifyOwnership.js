
/**
 * @description Verifies that the user ID from the JWT matches the user ID from the source
 * @param {*} jwt_user from verifyJWT middleware, contains the user ID from the JWT
 * @param {*} user_id from a dynamic source, such as a table user_id field or URL parameter
 * @example verifyOwnership(req.jwt_user, user_id)
 */
const verifyOwnership = (jwt_user, user_id) => {
  try {
    console.log('Token user ID:', jwt_user.userId)
    if (!jwt_user) {
      return { status: 401, message: 'Authentication required' }
    }
    console.log('Requested user ID:', user_id)
    if (jwt_user.userId.toLowerCase() !== user_id.toLowerCase()) {
      return { status: 403, message: 'Access denied - you can only modify your own account' }
    }
    console.log('Ownership verified')
    return { status: 200, message: 'Ownership verified' }
  } catch (error) {
    console.error('User ownership verification error:', error)
    return { status: 500, message: 'Internal server error during authorization' }
  }
}

export default verifyOwnership