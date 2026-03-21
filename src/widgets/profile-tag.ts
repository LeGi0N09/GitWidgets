require('dotenv').config()

import axios from 'axios'
import { resolveTheme, requestInBase64 } from '../utils'
import errorWidget from './error'

export default async function profileTagWidget(username: string, themeString?: string, scaleParam?: string): Promise<string> {
    const theme = resolveTheme(themeString)
    const scale = Math.max(0.5, Math.min(3, parseFloat(scaleParam ?? '') || 1))

    const HEIGHT         = Math.round(52 * scale)
    const AVATAR_SIZE    = Math.round(38 * scale)
    const H_PAD          = Math.round(8  * scale)
    const AVATAR_TEXT_GAP = Math.round(10 * scale)
    const FONT_NAME      = Math.round(15 * scale)
    const FONT_HANDLE    = Math.round(12 * scale)
    const LINE_GAP       = Math.round(4  * scale)

    try {
        const { data: user } = await axios.get(`https://api.github.com/users/${username}`)
        const avatar = await requestInBase64(user.avatar_url)

        const displayName: string = user.name ?? user.login
        const handle = `@${user.login}`

        const nameWidth   = displayName.length * FONT_NAME   * 0.62
        const handleWidth = handle.length      * FONT_HANDLE * 0.62
        const textWidth   = Math.max(nameWidth, handleWidth)
        const tagWidth    = H_PAD + AVATAR_SIZE + AVATAR_TEXT_GAP + textWidth + H_PAD * 2

        const avatarX = H_PAD
        const avatarY = (HEIGHT - AVATAR_SIZE) / 2
        const textX   = avatarX + AVATAR_SIZE + AVATAR_TEXT_GAP
        const nameY   = HEIGHT / 2 - LINE_GAP / 2 - 1
        const handleY = HEIGHT / 2 + FONT_HANDLE + LINE_GAP / 2
        const rx      = HEIGHT / 2

        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            width="${tagWidth}" height="${HEIGHT}" viewBox="0 0 ${tagWidth} ${HEIGHT}">
            <defs>
                <clipPath id="avatar-clip-${username}">
                    <circle cx="${avatarX + AVATAR_SIZE / 2}" cy="${avatarY + AVATAR_SIZE / 2}" r="${AVATAR_SIZE / 2}"/>
                </clipPath>
                <!-- Glass shimmer -->
                <linearGradient id="tag-sheen-${username}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.18"/>
                    <stop offset="60%"  stop-color="#ffffff" stop-opacity="0.04"/>
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0"/>
                </linearGradient>
                <!-- Soft glow -->
                <filter id="tag-shadow-${username}" x="-8%" y="-15%" width="116%" height="130%">
                    <feDropShadow dx="0" dy="${Math.round(2 * scale)}" stdDeviation="${Math.round(4 * scale)}"
                        flood-color="#000000" flood-opacity="0.15"/>
                </filter>
            </defs>

            <!-- Pill base with shadow -->
            <rect width="${tagWidth}" height="${HEIGHT}" rx="${rx}"
                fill="${theme.background}" filter="url(#tag-shadow-${username})"/>

            <!-- Inner border -->
            <rect width="${tagWidth}" height="${HEIGHT}" rx="${rx}"
                fill="none" stroke="${theme.title}" stroke-width="1.5" stroke-opacity="0.15"/>

            <!-- Glass shimmer -->
            <rect width="${tagWidth}" height="${HEIGHT}" rx="${rx}"
                fill="url(#tag-sheen-${username})"/>

            <!-- Avatar -->
            <image x="${avatarX}" y="${avatarY}"
                width="${AVATAR_SIZE}" height="${AVATAR_SIZE}"
                clip-path="url(#avatar-clip-${username})"
                xlink:href="data:image/jpeg;base64,${avatar}"/>

            <!-- Avatar ring -->
            <circle cx="${avatarX + AVATAR_SIZE / 2}" cy="${avatarY + AVATAR_SIZE / 2}" r="${AVATAR_SIZE / 2}"
                fill="none" stroke="#ffffff" stroke-width="${Math.round(1.5 * scale)}" stroke-opacity="0.3"/>

            <!-- Name -->
            <text x="${textX}" y="${nameY}"
                font-size="${FONT_NAME}" font-family="Roboto-Medium, Roboto, sans-serif"
                font-weight="600" fill="${theme.title}" dominant-baseline="auto">
                ${displayName}
            </text>

            <!-- Handle -->
            <text x="${textX}" y="${handleY}"
                font-size="${FONT_HANDLE}" font-family="Roboto-Regular, Roboto, sans-serif"
                fill="${theme.subtitle}" dominant-baseline="auto">
                ${handle}
            </text>
        </svg>`
    } catch (err) {
        console.error('Profile tag widget error:', err)
        return errorWidget('Profile Tag', '-25%', 'GitHub API-call error!', '-24%')
    }
}
