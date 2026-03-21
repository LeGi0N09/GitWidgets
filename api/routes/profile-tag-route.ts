import { Request, Response } from 'express'
import express from 'express'
const router = express.Router()

import profileTagWidget from '../../src/widgets/profile-tag'
import errorWidget from '../../src/widgets/error'
const githubUsernameRegex = require('github-username-regex')

router.get('/', function (req: Request, res: Response) {
    const { username, theme, scale } = req.query

    res.setHeader('Content-Type', 'image/svg+xml')

    if (!username) {
        res.send(errorWidget('Profile Tag', '-25%', 'Username is undefined!', '-26%'))
        return
    }

    if (!githubUsernameRegex.test(username)) {
        res.send(errorWidget('Profile Tag', '-25%', 'Username is invalid!', '-22%'))
        return
    }

    profileTagWidget(String(username), String(theme), String(scale)).then((response) => {
        res.send(response ?? errorWidget('Profile Tag', '-25%', 'GitHub API-call error!', '-24%'))
    })
})

export default router
