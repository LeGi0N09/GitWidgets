import { Request, Response } from 'express'
import express from 'express'
const router = express.Router()

import skillTagWidget from '../../src/widgets/skill-tag'
import errorWidget from '../../src/widgets/error'

router.get('/', function (req: Request, res: Response) {
    const { skill, theme, scale } = req.query

    res.setHeader('Content-Type', 'image/svg+xml')

    if (!skill) {
        res.send(errorWidget('Skill Tag', '-25%', 'Skill is undefined!', '-24%'))
        return
    }

    res.send(skillTagWidget(String(skill), String(theme), String(scale)))
})

export default router
