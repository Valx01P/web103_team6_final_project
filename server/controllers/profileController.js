import PostgresService from "../services/postgresService.js"

const Profile = new PostgresService("profiles")

const profileController = {
  async getProfile(req, res) {
    try {
      const user_id = req.jwt_user.userId
      const profile = await Profile.get_by_field("user_id", user_id)
      if (profile.length === 0) {
        return res.status(404).json({
          message: "Profile not created yet"
        })
      }
      return res.status(200).json({
        message: "Profile successfully retrieved",
        profile: profile
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async createProfile(req, res) {
    try {
      const user_id = req.jwt_user.userId
      const profile_found = await Profile.get_by_field("user_id", user_id)
      if (profile_found.length > 0) {
        return res.status(400).json({
          message: "Profile already created"
        })
      }
      const profile_data = { ...req.body, user_id: user_id }

      const profile = await Profile.save(profile_data)
      return res.status(201).json({
        message: "Profile successfully created",
        profile: profile
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async updateProfile(req, res) {
    try {
      const user_id = req.jwt_user.userId
      const current_profile = await Profile.get_by_field("user_id", user_id)

      console.log(current_profile)
      if (current_profile.length === 0) {
        return res.status(404).json({
          message: "Profile not created yet"
        })
      } else if (current_profile.length > 1) {
        return res.status(400).json({
          message: "Multiple profiles found"
        })
      }

      const current_profile_data = current_profile[0]
      console.log(current_profile_data)

      const profile = await Profile.update(current_profile_data.id, req.body)
      
      console.log(profile) 
      return res.status(200).json({
        message: "Profile successfully updated",
        profile: profile
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }
}

export default profileController