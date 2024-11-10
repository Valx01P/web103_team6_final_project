import express from 'express'
import tagController from '../controllers/tagController.js'

const router = express.Router()

router.route('/')
    .get(tagController.getAllTags)
    .post(tagController.createTag)
    

router.route('/:id')
    .get(tagController.getTagById)
    .delete(tagController.deleteTag)
    .patch(tagController.updateTag)


export default router