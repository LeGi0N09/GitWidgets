require('dotenv').config()

import { Request, Response } from 'express'
import errorWidget from '../src/widgets/error'
import routes from './routes'

// Setup express
import express from 'express'
const app = express()

// Use routing on the /api prefix and root (Vercel strips /api prefix)
app.use('/api', routes)
app.use('/', routes)

// Send error widget for incorrect request URL
app.use('*', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'image/svg+xml')
    res.send(errorWidget('Unknown', '-28%', 'Invalid API URL!', '-19%'))
})

const PORT = process.env.PORT ?? (process.env.NODE_ENV === 'production' ? undefined : 3000)

// Start listening on defined port
app.listen(PORT, () => {
    console.log(`GitWidgets listening at http://localhost:${PORT}`)
})
