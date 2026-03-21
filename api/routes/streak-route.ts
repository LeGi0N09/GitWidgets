import { Request, Response } from 'express'
import express from 'express'
const router = express.Router()

import streakWidget from '../../src/widgets/streak'
import errorWidget from '../../src/widgets/error'
const githubUsernameRegex = require('github-username-regex')

router.get('/', function (req: Request, res: Response) {
    const { username, theme, width } = req.query

    res.setHeader('Content-Type', 'image/svg+xml')

    if (!username) {
        res.send(errorWidget('Streak', '-25%', 'Username is undefined!', '-26%'))
        return
    }

    if (!githubUsernameRegex.test(username)) {
        res.send(errorWidget('Streak', '-25%', 'Username is invalid!', '-22%'))
        return
    }

    streakWidget(String(username), String(theme), String(width)).then((response) => {
        res.send(response ?? errorWidget('Streak', '-25%', 'GitHub API-call error!', '-24%'))
    })
})

export default router
