import { findData, resolveTheme } from '../utils'
import languageData from '../data/languages'
import frameworks from '../data/frameworks'
import libraries from '../data/libraries'
import tools from '../data/tools'
import softwareIDEs from '../data/software-ides'
import errorWidget from './error'

export default function skillTagWidget(skill: string, themeString?: string, scaleParam?: string): string {
    const theme = resolveTheme(themeString)
    const scale = Math.max(0.5, Math.min(3, parseFloat(scaleParam ?? '') || 1))

    const TAG_HEIGHT = Math.round(48 * scale)
    const ICON_BOX = Math.round(40 * scale)
    const FONT_SIZE = Math.round(14 * scale)
    const H_PAD = Math.round(14 * scale)
    const ICON_TEXT_GAP = Math.round(8 * scale)

    const data =
        findData(languageData, skill) ||
        findData(frameworks, skill) ||
        findData(libraries, skill) ||
        findData(tools, skill) ||
        findData(softwareIDEs, skill)

    if (!data) {
        return errorWidget('Skill Tag', '-25%', `Skill "${skill}" not found!`, '-28%')
    }

    const label = data.name[0]
    const textWidth = label.length * FONT_SIZE * 0.6
    const tagWidth = H_PAD + ICON_BOX + ICON_TEXT_GAP + textWidth + H_PAD

    const iconScale = Math.min((ICON_BOX - 8 * scale) / data.width, (ICON_BOX - 8 * scale) / data.height)
    const iconX = H_PAD + (ICON_BOX - data.width * iconScale) / 2
    const iconY = (TAG_HEIGHT - data.height * iconScale) / 2

    const uid = skill.replace(/[^a-z0-9]/gi, '').toLowerCase()

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        width="${tagWidth}" height="${TAG_HEIGHT}" viewBox="0 0 ${tagWidth} ${TAG_HEIGHT}">
        <defs>
            <linearGradient id="grad-${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${data.colorFrom};stop-opacity:1"/>
                <stop offset="100%" style="stop-color:${data.colorTo};stop-opacity:1"/>
            </linearGradient>
        </defs>
        <rect width="${tagWidth}" height="${TAG_HEIGHT}" rx="${TAG_HEIGHT / 2}"
            fill="${theme.background}" stroke="${data.colorTo}" stroke-width="1.5"/>
        <rect x="${H_PAD - 2 * scale}" y="${(TAG_HEIGHT - ICON_BOX) / 2}"
            width="${ICON_BOX}" height="${ICON_BOX}" rx="${ICON_BOX / 2}"
            fill="url(#grad-${uid})"/>
        <g transform="translate(${iconX} ${iconY}) scale(${iconScale})">
            ${data.icon}
        </g>
        <text x="${H_PAD + ICON_BOX + ICON_TEXT_GAP}" y="${TAG_HEIGHT / 2 + FONT_SIZE * 0.35}"
            font-size="${FONT_SIZE}" font-family="Roboto-Medium, Roboto, sans-serif"
            font-weight="500" fill="${theme.title}">
            ${label}
        </text>
    </svg>`
}
