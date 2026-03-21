require('dotenv').config()

import axios from 'axios'
import { resolveTheme, requestInBase64 } from '../utils'
import errorWidget from './error'
import buildCard from '../components/card'
import getGithubUserStats from '../fetchers/user-stats-fetcher'
import { Repository } from '../interfaces/Repositories'

const DEFAULT_WIDTH = 842
const DEFAULT_HEIGHT = 280

export default async function profileBannerWidget(
    username: string,
    themeString?: string,
    widthParam?: string
): Promise<string> {
    const theme = resolveTheme(themeString)
    const WIDTH = Math.max(400, Math.min(1200, parseInt(widthParam ?? '') || DEFAULT_WIDTH))
    const HEIGHT = Math.round(DEFAULT_HEIGHT * (WIDTH / DEFAULT_WIDTH))
    const scale = WIDTH / DEFAULT_WIDTH

    try {
        const [profileRes, userRes] = await Promise.all([
            getGithubUserStats(process.env.GITHUB_TOKEN, username),
            axios.get(`https://api.github.com/users/${username}`)
        ])

        if (!profileRes?.data?.user) {
            return errorWidget('Profile Banner', '-25%', 'GitHub API-call error!', '-24%')
        }

        const user = userRes.data
        const avatar = await requestInBase64(user.avatar_url)
        const stats = profileRes.data.user
        const totalStars = stats.repositories.nodes
            .map((r: Repository) => r.stargazers.totalCount)
            .reduce((a: number, b: number) => a + b, 0)
        const totalCommits = stats.contributionsCollection.contributionCalendar.totalContributions

        // Layout constants scaled
        const PAD = Math.round(40 * scale)
        const AVATAR_SIZE = Math.round(120 * scale)
        const AVATAR_RX = Math.round(24 * scale)
        const TEXT_X = PAD + AVATAR_SIZE + Math.round(28 * scale)

        // Name
        const nameFontSize = Math.round(32 * scale)
        const nameY = PAD + Math.round(38 * scale)
        const nameCharWidth = nameFontSize * 0.58
        const nameMaxWidth = WIDTH - TEXT_X - PAD
        const rawName: string = user.name ?? user.login
        const nameMaxChars = Math.floor(nameMaxWidth / nameCharWidth)
        const displayName = rawName.length > nameMaxChars
            ? rawName.slice(0, Math.max(1, nameMaxChars - 1)) + '…'
            : rawName

        // Handle
        const handleFontSize = Math.round(18 * scale)
        const handleY = nameY + Math.round(30 * scale)

        // Bio
        const bioFontSize = Math.round(15 * scale)
        const bioY = handleY + Math.round(30 * scale)
        const bioMaxWidth = WIDTH - TEXT_X - PAD
        const bioCharWidth = bioFontSize * 0.55
        const bioMaxChars = Math.floor(bioMaxWidth / bioCharWidth)
        const rawBio: string = user.bio ?? ''
        const bio = rawBio.length > bioMaxChars
            ? rawBio.slice(0, Math.max(1, bioMaxChars - 1)) + '…'
            : rawBio

        // Stat pills
        const pillH = Math.round(34 * scale)
        const pillRx = Math.round(17 * scale)
        const pillFontSize = Math.round(13 * scale)
        const pillLabelSize = Math.round(11 * scale)
        const pillsY = HEIGHT - PAD - pillH
        const pillGap = Math.round(12 * scale)

        const statDefs = [
            { label: 'Followers', value: stats.followers.totalCount, bg: '#CAF0FF', fg: '#00C6FF' },
            { label: 'Repos',     value: stats.repositories.totalCount, bg: '#FFCEE4', fg: '#FF0774' },
            { label: 'Stars',     value: totalStars,  bg: '#FFEFCD', fg: '#FFA100' },
            { label: 'Commits',   value: totalCommits, bg: '#C5FFD9', fg: '#00F14F' },
        ]

        // Measure pill widths: label or value, whichever is wider, + padding
        const H_PILL_PAD = Math.round(16 * scale)
        const pillWidths = statDefs.map(s => {
            const valW = String(s.value).length * pillFontSize * 0.65
            const lblW = s.label.length * pillLabelSize * 0.62
            return Math.round(Math.max(valW, lblW) + H_PILL_PAD * 2)
        })
        const totalPillsWidth = pillWidths.reduce((a, b) => a + b, 0) + pillGap * (statDefs.length - 1)

        // Start pills from left aligned under text column, or center if narrow
        const pillsStartX = Math.min(TEXT_X, (WIDTH - totalPillsWidth) / 2)

        let pillsX = pillsStartX
        const pills = statDefs.map((s, i) => {
            const pw = pillWidths[i]
            const cx = pillsX + pw / 2
            const svg = `
            <g transform="translate(${pillsX} ${pillsY})">
                <rect width="${pw}" height="${pillH}" rx="${pillRx}" fill="${s.bg}"/>
                <text x="${pw / 2}" y="${Math.round(pillH * 0.42)}"
                    text-anchor="middle" dominant-baseline="middle"
                    font-size="${pillLabelSize}" font-family="Roboto-Regular, Roboto, sans-serif"
                    fill="${s.fg}" opacity="0.8">${s.label}</text>
                <text x="${pw / 2}" y="${Math.round(pillH * 0.75)}"
                    text-anchor="middle" dominant-baseline="middle"
                    font-size="${pillFontSize}" font-family="Roboto-Medium, Roboto, sans-serif"
                    font-weight="600" fill="${s.fg}">${s.value}</text>
            </g>`
            pillsX += pw + pillGap
            return svg
        }).join('')

        // Divider line between avatar column and text column
        const dividerX = PAD + AVATAR_SIZE + Math.round(14 * scale)
        const dividerY1 = PAD
        const dividerY2 = HEIGHT - PAD

        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
            <defs>
                <pattern id="avatar-pattern" preserveAspectRatio="xMidYMid slice"
                    width="100%" height="100%" viewBox="0 0 200 200">
                    <image width="200" height="200" xlink:href="data:image/jpeg;base64,${avatar}"/>
                </pattern>
            </defs>
            ${buildCard(WIDTH, HEIGHT, theme.background)}
            <rect x="${PAD}" y="${PAD}" width="${AVATAR_SIZE}" height="${AVATAR_SIZE}"
                rx="${AVATAR_RX}" fill="url(#avatar-pattern)"/>
            <line x1="${dividerX}" y1="${dividerY1}" x2="${dividerX}" y2="${dividerY2}"
                stroke="${theme.title}" stroke-width="1" stroke-opacity="0.12"/>
            <text x="${TEXT_X}" y="${nameY}"
                font-size="${nameFontSize}" font-family="Roboto-Medium, Roboto, sans-serif"
                font-weight="600" fill="${theme.title}">${displayName}</text>
            <text x="${TEXT_X}" y="${handleY}"
                font-size="${handleFontSize}" font-family="Roboto-Regular, Roboto, sans-serif"
                fill="${theme.subtitle}">@${user.login}</text>
            ${bio ? `<text x="${TEXT_X}" y="${bioY}"
                font-size="${bioFontSize}" font-family="Roboto-Regular, Roboto, sans-serif"
                fill="${theme.title}" opacity="0.7">${bio}</text>` : ''}
            ${pills}
        </svg>`
    } catch (err) {
        console.error('Profile banner widget error:', err)
        return errorWidget('Profile Banner', '-25%', 'GitHub API-call error!', '-24%')
    }
}
