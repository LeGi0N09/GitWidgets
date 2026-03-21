export default function buildGradientBox(
    id: number,
    fromColor: string,
    toColor: string,
    transX: number,
    transY: number
): string {
    return `<defs>
                <linearGradient id="linear-gradient${id}" x1="0.085" y1="0.941" x2="0.939" y2="0.123" gradientUnits="objectBoundingBox">
                    <stop offset="0" stop-color="${fromColor}"/>
                    <stop offset="1" stop-color="${toColor}"/>
                </linearGradient>
                <!-- Glass sheen: bright top-left highlight -->
                <linearGradient id="glass-sheen${id}" x1="0" y1="0" x2="0.6" y2="1">
                    <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.35"/>
                    <stop offset="55%"  stop-color="#ffffff" stop-opacity="0.08"/>
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0"/>
                </linearGradient>
            </defs>
            <!-- Base gradient box -->
            <rect id="gradient-box${id}" transform="translate(${transX} ${transY})"
                width="80" height="80" rx="20"
                fill="url(#linear-gradient${id})"/>
            <!-- Glass sheen overlay -->
            <rect transform="translate(${transX} ${transY})"
                width="80" height="80" rx="20"
                fill="url(#glass-sheen${id})"/>
            <!-- Inner border -->
            <rect transform="translate(${transX} ${transY})"
                width="80" height="80" rx="20"
                fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.25"/>
`
}
