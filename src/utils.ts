import axios from 'axios'
import { IconData } from './interfaces/IconData'
import { Theme } from './interfaces/Theme'
import themes from './data/themes'

export function isValidHexColor(hexColor: string): boolean {
    return /^([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{4})$/.test(hexColor)
}

export function getBoolean(str: string): boolean {
    return str.toLowerCase() === 'true'
}

export async function requestInBase64(url: string): Promise<Object> {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    return Buffer.from(response.data, 'binary').toString('base64')
}

export function findData(data: IconData[], name: string): IconData {
    return data.find(d => d.name.map(n => n.toUpperCase()).includes(name.toUpperCase()))
}

export function resolveTheme(themeName?: string): Theme {
    const theme = themeName ? getTheme(themes, themeName) : null
    return theme ?? getTheme(themes, 'default')
}

export function getTheme(themeList: Theme[], themeName: string): Theme {
    return themeList.find(t => t.name.map(n => n.toUpperCase()).includes(themeName.toUpperCase()))
}
