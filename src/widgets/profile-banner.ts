require('dotenv').config()

import axios from 'axios'
import { resolveTheme, requestInBase64 } from '../utils'
import errorWidget from './error'
import buildCard from '../components/card'
import getGithubUserStats from '../fetchers/user-stats-fetcher'
import { Repository } from '../interfaces/Repositories'

const DEFAULT_WIDTH  = 842
const DEFAULT_HEIGHT = 200

function truncate(text: string, maxChars: number): string {
    return text.length > maxChars ? text.slice(0, Math.max(1, maxChars - 1)) + '…' : text
}

export default async function profileBannerWidget(
    username: string,
    themeString?: string,
    widthParam?: string
): Promise<string> {
    const theme = resolveTheme(themeString)
    const WIDTH  = Math.max(400, Math.min(1200, parseInt(widthParam ?? '') || DEFAULT_WIDTH))
    const HEIGHT = Math.round(DEFAULT_HEIGHT * (WIDTH / DEFAULT_WIDTH))
    const scale  = WIDTH / DEFAULT_WIDTH

    try {
        const [profileRes, userRes] = await Promise.all([
            getGithubUserStats(process.env.GITHUB_TOKEN, username),
            axios.get(`https://api.github.com/users/${username}`)
        ])

        if (!profileRes?.data?.user) {
            return errorWidget('Profile Banner', '-25%', 'GitHub API-call error!', '-24%')
        }

        const user   = userRes.data
        const avatar = await requestInBase64(user.avatar_url)
        const stats  = profileRes.data.user

        const totalStars   = stats.repositories.nodes
            .map((r: Repository) => r.stargazers.totalCount)
            .reduce((a: number, b: number) => a + b, 0)
        const totalCommits = stats.contributionsCollection.contributionCalendar.totalContributions

        // ── Same scale variables as profile.ts ────────────────────────────────
        const boxW       = Math.round(90  * scale)
        const boxH       = Math.round(37  * scale)
        const boxRx      = Math.round(18.5 * scale)
        const boxSpacing = Math.round(108 * scale)
        const fontSize   = Math.round(16  * scale)
        const iconOffset = Math.round(71  * scale)

        // Avatar — same style as profile.ts (rounded rect)
        const avatarSize = Math.round(80  * scale)
        const avatarX    = Math.round(52  * scale)
        const avatarY    = Math.round((HEIGHT - avatarSize) / 2)
        const avatarRx   = Math.round(30  * scale)

        // Text column
        const nameX        = Math.round(160 * scale)
        const nameY        = Math.round(HEIGHT / 2 - 28 * scale)
        const handleY      = nameY + Math.round(26 * scale)
        const bioY         = handleY + Math.round(22 * scale)
        const nameFontSize = Math.round(26 * scale)
        const handleFontSize = Math.round(14 * scale)
        const bioFontSize  = Math.round(12 * scale)

        // Truncate name
        const dataBoxesWidth = 4 * boxSpacing
        const nameMaxWidth   = WIDTH - nameX - dataBoxesWidth - Math.round(20 * scale)
        const displayName    = truncate(user.name ?? user.login, Math.floor(nameMaxWidth / (nameFontSize * 0.6)))
        const bio            = truncate(user.bio ?? '', Math.floor((WIDTH - nameX - dataBoxesWidth - Math.round(20 * scale)) / (bioFontSize * 0.54)))

        // ── 4 data boxes — same pill style as profile.ts ─────────────────────
        const statDefs = [
            {
                name: 'followers', value: stats.followers.totalCount,
                color1: '#CAF0FF', color2: '#00C6FF',
                svg: 'M3.625,9.5A2.417,2.417,0,1,0,1.208,7.084,2.419,2.419,0,0,0,3.625,9.5Zm16.919,0a2.417,2.417,0,1,0-2.417-2.417A2.419,2.419,0,0,0,20.544,9.5Zm1.208,1.208H19.336a2.41,2.41,0,0,0-1.7.7,5.524,5.524,0,0,1,2.836,4.132h2.493a1.207,1.207,0,0,0,1.208-1.208V13.126A2.419,2.419,0,0,0,21.753,10.709Zm-9.668,0a4.23,4.23,0,1,0-4.23-4.23A4.228,4.228,0,0,0,12.085,10.709Zm2.9,1.208h-.313a5.84,5.84,0,0,1-5.174,0H9.185a4.352,4.352,0,0,0-4.351,4.351v1.088a1.813,1.813,0,0,0,1.813,1.813H17.523a1.813,1.813,0,0,0,1.813-1.813V16.269A4.352,4.352,0,0,0,14.985,11.918Zm-8.448-.506a2.41,2.41,0,0,0-1.7-.7H2.417A2.419,2.419,0,0,0,0,13.126v1.208a1.207,1.207,0,0,0,1.208,1.208H3.7A5.538,5.538,0,0,1,6.537,11.412Z',
                tX: Math.round(-43 * scale)
            },
            {
                name: 'repositories', value: stats.repositories.totalCount,
                color1: '#FFCEE4', color2: '#FF0774',
                svg: 'M7.106,3A2.106,2.106,0,0,0,5,5.106V17.74a.7.7,0,0,0,.207.5,2.026,2.026,0,0,0,1.9,1.608h.7v-1.4h-.7a.7.7,0,0,1,0-1.4H17.634a1.4,1.4,0,0,0,1.4-1.4V4.4a1.4,1.4,0,0,0-1.4-1.4Zm.7,2.106h.7a.7.7,0,0,1,.7.7v.7a.7.7,0,0,1-.7.7h-.7a.7.7,0,0,1-.7-.7v-.7A.7.7,0,0,1,7.808,5.106Zm0,3.51h.7a.7.7,0,0,1,.7.7v.7a.7.7,0,0,1-.7.7h-.7a.7.7,0,0,1-.7-.7v-.7A.7.7,0,0,1,7.808,8.615Zm0,3.51h.7a.7.7,0,0,1,.7.7v.7a.7.7,0,0,1-.7.7h-.7a.7.7,0,0,1-.7-.7v-.7A.7.7,0,0,1,7.808,12.125Zm1.4,6.317v3.51l2.106-1.4,2.106,1.4v-3.51Zm5.615,0v1.4h3.51a.7.7,0,0,0,0-1.4Z',
                tX: Math.round(-47 * scale)
            },
            {
                name: 'stars', value: totalStars,
                color1: '#FFEFCD', color2: '#FFA100',
                svg: 'M9.6.608,7.369,5.131l-4.992.728a1.094,1.094,0,0,0-.6,1.865l3.611,3.519L4.53,16.215a1.093,1.093,0,0,0,1.585,1.151l4.465-2.347,4.465,2.347a1.094,1.094,0,0,0,1.585-1.151l-.854-4.971,3.611-3.519a1.094,1.094,0,0,0-.6-1.865l-4.992-.728L11.561.608A1.094,1.094,0,0,0,9.6.608Z',
                tX: Math.round(-47 * scale)
            },
            {
                name: 'commits', value: totalCommits,
                color1: '#C5FFD9', color2: '#00F14F',
                svg: null,
                tX: Math.round(-47 * scale)
            },
        ]

        const dataBoxesX = WIDTH - Math.round(52 * scale)
        const dataBoxesY = (HEIGHT - boxH) / 2

        const dataBoxes = statDefs.map((st, i) => {
            const offsetX = (statDefs.length - 1 - i) * -boxSpacing
            const iconSvg = st.svg
                ? `<path transform="translate(-${iconOffset} ${st.name === 'stars' ? Math.round(10 * scale) : Math.round(8 * scale)}) scale(${scale})" fill="${st.color2}" d="${st.svg}"/>`
                : `<g transform="translate(-${iconOffset} ${Math.round(9 * scale)}) scale(${scale})">
                    <path d="M0,0H20.592V20.592H0Z" fill="none"/>
                    <path d="M12.438,14.87v5.148H10.722V14.87H8.148l3.432-4.29,3.432,4.29Zm1.716,1.716h2.574V14.012h-.686L11.58,8.435,6.987,14.012H6a1.287,1.287,0,0,0,0,2.574h3V18.3H6a3,3,0,0,1-3-3V4.574A2.574,2.574,0,0,1,5.574,2H17.586a.858.858,0,0,1,.858.858V17.444a.858.858,0,0,1-.858.858H14.154ZM6.432,4.574V6.29H8.148V4.574Zm0,2.574V8.864H8.148V7.148Z" transform="translate(-0.426 -0.284)" fill="${st.color2}"/>
                   </g>`

            return `<g transform="translate(${offsetX} 0)">
                <rect width="${boxW}" height="${boxH}" rx="${boxRx}" transform="translate(-${boxW} 0)" fill="${st.color1}"/>
                <text transform="translate(${st.tX} ${Math.round(25 * scale)})" fill="${st.color2}"
                    font-size="${fontSize}" font-family="Roboto-Regular, Roboto, sans-serif">
                    <tspan x="0" y="0">${st.value}</tspan>
                </text>
                ${iconSvg}
            </g>`
        }).join('')

        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
            <defs>
                <pattern id="banner-avatar" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" viewBox="0 0 ${avatarSize} ${avatarSize}">
                    <image width="${avatarSize}" height="${avatarSize}" xlink:href="data:image/jpeg;base64,${avatar}"/>
                </pattern>
            </defs>

            ${buildCard(WIDTH, HEIGHT, theme.background)}

            <!-- Avatar — same rounded-rect style as profile widget -->
            <rect width="${avatarSize}" height="${avatarSize}" rx="${avatarRx}"
                transform="translate(${avatarX} ${avatarY})" fill="url(#banner-avatar)"/>

            <!-- Name -->
            <text fill="${theme.title}" transform="translate(${nameX} ${nameY})"
                font-size="${nameFontSize}" font-family="Roboto-Medium, Roboto, sans-serif" font-weight="500">
                <tspan x="0" y="0">${displayName}</tspan>
            </text>

            <!-- Handle -->
            <text transform="translate(${nameX} ${handleY})"
                fill="${theme.subtitle}" font-size="${handleFontSize}"
                font-family="Roboto-Regular, Roboto, sans-serif">
                <tspan x="0" y="0">@${user.login}</tspan>
            </text>

            ${bio ? `<!-- Bio -->
            <text transform="translate(${nameX} ${bioY})"
                fill="${theme.title}" opacity="0.5" font-size="${bioFontSize}"
                font-family="Roboto-Regular, Roboto, sans-serif">
                <tspan x="0" y="0">${bio}</tspan>
            </text>` : ''}

            <!-- Data boxes — identical pill style to profile widget -->
            <g transform="translate(${dataBoxesX} ${dataBoxesY})">
                ${dataBoxes}
            </g>
        </svg>`

    } catch (err) {
        console.error('Profile banner widget error:', err)
        return errorWidget('Profile Banner', '-25%', 'GitHub API-call error!', '-24%')
    }
}
