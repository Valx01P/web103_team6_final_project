import PostgresService from "../services/postgresService.js"

const Tag = new PostgresService('tags')

const tagsController = {
    async getAllTags (req, res) {
        try {
            const tags = await Tag.get_all()

            res.status(201).json({
                "data": tags
            })

        } catch (err) {
            res.status(409).json( {error: err.message } )
        }
    },

    async getTagById (req, res) {
        try {
            const tagId = req.params.id
            const tag = await Tag.get_by_id(tagId)

            res.status(201).json({
                "data": tag
            })

        } catch (err) {
            res.status(409).json( {error: err.message } )
        }
    },

    async createTag (req, res) {
        try {
            const tag = await Tag.save(req.body)
            res.status(201).json({
                "data": tag
            })
        } catch (err) {
            res.status(409).json( { error: err.message } )
        }
    },

    async updateTag (req, res) {
        try {
            const id = parseInt(req.params.id)
            const tag = await Tag.update(id, req.body)

            res.status(201).json({
                "data": tag
            })
        } catch (err) {
            res.status(409).json( { error: err.message } )
        }
    },

    async deleteTag (req, res) {
        try {
            const tagId = req.params.id
            const tag = await Tag.delete(tagId)

            res.status(201).json({
                "data": tag
            })
        } catch (err) {
            res.status(409).json( {error: err.message } )
        }
    }

}

export default tagsController