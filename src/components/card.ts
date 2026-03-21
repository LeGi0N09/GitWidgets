export default function buildCard(
    width: number,
    height: number,
    bg: string
): string {
    const rx = 30
    const x = 15
    const y = 12
    const w = width  - 30
    const h = height - 30

    return `<defs>
                <!-- Outer drop shadow -->
                <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
                    <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#000000" flood-opacity="0.18"/>
                </filter>
                <!-- Inner glow / highlight -->
                <filter id="card-inner-glow" x="0" y="0" width="100%" height="100%">
                    <feGaussianBlur stdDeviation="6" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
                <!-- Glass shimmer gradient -->
                <linearGradient id="glass-shimmer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.13"/>
                    <stop offset="50%"  stop-color="#ffffff" stop-opacity="0.04"/>
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0"/>
                </linearGradient>
            </defs>

            <!-- Base card with shadow -->
            <g filter="url(#card-shadow)">
                <rect width="${w}" height="${h}" rx="${rx}" x="${x}" y="${y}" fill="${bg}"/>
            </g>

            <!-- Glass shimmer overlay -->
            <rect width="${w}" height="${h}" rx="${rx}" x="${x}" y="${y}"
                fill="url(#glass-shimmer)"/>

            <!-- Inner border highlight (top-left bright edge) -->
            <rect width="${w}" height="${h}" rx="${rx}" x="${x}" y="${y}"
                fill="none"
                stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.18"/>`
}
