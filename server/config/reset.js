import { pool } from "./database.js"
import './dotenv.js'
import tagData from '../data/tagData.js'

async function clearTagsTable() {
    const clearQuery = {
        text: 'DELETE FROM tags'
    }

    try {
        const res = await pool.query(clearQuery)
        console.log('cleared the tags table')
    } catch (err) {
        console.error('error when clearing tags table', err)
    }
}

async function seedTagsTable() {
    await clearTagsTable()

    tagData.forEach(tag => {
        const insertQuery = {
            text: 'INSERT INTO tags (id, name, text) VALUES ($1, $2, $3)'
        }

        const values = [
            tag.id,
            tag.name,
            tag.description
        ]

        pool.query(insertQuery, values, (err, res) => {
            if (err) {
                console.error('error inserting tag', err)
                return
            }

            console.log(`${tag.name} added`)
        })
    })

}

seedTagsTable()