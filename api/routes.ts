import express from 'express'
const router = express.Router()

import skillsRoute from './routes/skills-route'
import profileRoute from './routes/profile-route'
import streakRoute from './routes/streak-route'
import skillTagRoute from './routes/skill-tag-route'
import profileTagRoute from './routes/profile-tag-route'
import profileBannerRoute from './routes/profile-banner-route'

// Skills widget
router.use('/skills', skillsRoute)

// Profile widget
router.use('/profile', profileRoute)

// Streak widget
router.use('/streak', streakRoute)

// Skill Tag widget
router.use('/skill-tag', skillTagRoute)

// Profile Tag widget
router.use('/profile-tag', profileTagRoute)

// Profile Banner widget
router.use('/profile-banner', profileBannerRoute)

export default router
