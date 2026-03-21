require('dotenv').config()

import axios from 'axios'
import { resolveTheme, requestInBase64 } from '../utils'
import errorWidget from './error'
import buildCard from '../components/card'
import getGithubUserStats from '../fetchers/user-stats-fetcher'
import { ContributionDay } from '../interfaces/Contributions'

const DEFAULT_WIDTH = 842
const DEFAULT_HEIGHT = 165

function calculateStreak(weeks: { contributionDays: ContributionDay[] }[]): { current: number; longest: number; total: number } {
    const days = weeks.flatMap(w => w.contributionDays).sort((a, b) => a.date.localeCompare(b.date))
    const total = days.reduce((sum, d) => sum + d.contributionCount, 0)

    let current = 0
    let longest = 0
    let streak = 0

    const today = new Date().toISOString().split('T')[0]

    // Walk backwards from today to find current streak
    for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].date > today) continue
        if (days[i].contributionCount > 0) {
            current++
        } else {
            // Allow today to have 0 (day not over yet)
            if (days[i].date === today) continue
            break
        }
    }

    // Find longest streak
    for (const day of days) {
        if (day.contributionCount > 0) {
            streak++
            if (streak > longest) longest = streak
        } else {
            streak = 0
        }
    }

    return { current, longest, total }
}

export default async function streakWidget(username: string, themeString?: string, widthParam?: string): Promise<string> {
    const theme = resolveTheme(themeString)
    const WIDTH = Math.max(300, Math.min(1200, parseInt(widthParam ?? '') || DEFAULT_WIDTH))
    const HEIGHT = Math.round(DEFAULT_HEIGHT * (WIDTH / DEFAULT_WIDTH))
    const scale = WIDTH / DEFAULT_WIDTH

    try {
        const profile = await getGithubUserStats(process.env.GITHUB_TOKEN, username)
        if (!profile?.data?.user) {
            return errorWidget('Streak', '-25%', 'GitHub API-call error!', '-24%')
        }

        const weeks = profile.data.user.contributionsCollection.contributionCalendar.weeks
        const { current, longest, total } = calculateStreak(weeks)

        const response = await axios.get(`https://api.github.com/users/${username}`)
        const avatar = await requestInBase64(response.data.avatar_url)

        const boxW = Math.round(90 * scale)
        const boxRx = Math.round(18.5 * scale)
        const boxSpacing = Math.round(108 * scale)
        const fontSize = Math.round(16 * scale)
        const labelFontSize = Math.round(10 * scale)

        const statBox = (label: string, value: number, x: number, color1: string, color2: string) => `
            <g transform="translate(${x} 0)">
                <rect width="${boxW}" height="${Math.round(37 * scale)}" rx="${boxRx}" transform="translate(-${boxW} 0)" fill="${color1}"/>
                <text transform="translate(-${Math.round(47 * scale)} ${Math.round(25 * scale)})" fill="${color2}" font-size="${fontSize}" font-family="Roboto-Regular, Roboto, sans-serif">
                    <tspan x="0" y="0">${value}</tspan>
                </text>
                <text transform="translate(-${Math.round(47 * scale)} -${Math.round(8 * scale)})" fill="${color2}" font-size="${labelFontSize}" font-family="Roboto-Regular, Roboto, sans-serif">
                    <tspan x="0" y="0">${label}</tspan>
                </text>
            </g>`

        const dataBoxes =
            statBox('Current', current, (WIDTH - Math.round(52 * scale)) - boxSpacing * 2, '#FFE0CC', '#FF6B35') +
            statBox('Longest', longest, (WIDTH - Math.round(52 * scale)) - boxSpacing, '#FFEFCD', '#FFA100') +
            statBox('Total', total, (WIDTH - Math.round(52 * scale)), '#C5FFD9', '#00F14F')

        const avatarSize = Math.round(65 * scale)
        const avatarX = Math.round(52 * scale)
        const avatarY = Math.round(47 * scale)
        const avatarRx = Math.round(30 * scale)
        const nameX = Math.round(145 * scale)
        const nameY = Math.round(78 * scale)
        const subtitleY = Math.round(102 * scale)
        const nameFontSize = Math.round(26 * scale)
        const subtitleFontSize = Math.round(16 * scale)

        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
            <defs>
                <pattern id="pattern" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" viewBox="0 0 200 200">
                    <image width="200" height="200" xlink:href="data:image/jpeg;base64,${avatar}"/>
                </pattern>
            </defs>
            ${buildCard(WIDTH, HEIGHT, theme.background)}
            <g id="streak-card">
                <rect width="${avatarSize}" height="${avatarSize}" rx="${avatarRx}" transform="translate(${avatarX} ${avatarY})" fill="url(#pattern)"/>
                <text fill="${theme.title}" transform="translate(${nameX} ${nameY})" font-size="${nameFontSize}" font-family="Roboto-Medium, Roboto, sans-serif" font-weight="500">
                    <tspan x="0" y="0">${response.data.name ?? response.data.login}</tspan>
                </text>
                <text transform="translate(${nameX} ${subtitleY})" fill="#bfbfbf" font-size="${subtitleFontSize}" font-family="Roboto-Regular, Roboto, sans-serif">
                    <tspan x="0" y="0">Commit Streak</tspan>
                </text>
                <g id="data-boxes" transform="translate(0 ${(HEIGHT - Math.round(37 * scale)) / 2})">
                    ${dataBoxes}
                </g>
            </g>
        </svg>`
    } catch (err) {
        console.error('Streak widget error:', err)
        return errorWidget('Streak', '-25%', 'GitHub API-call error!', '-24%')
    }
}
