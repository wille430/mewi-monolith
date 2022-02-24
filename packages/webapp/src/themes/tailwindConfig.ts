import tailwindConfig from '../../tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'
import { TailwindThemeValue } from 'tailwindcss/tailwind-config'

const config = resolveConfig(tailwindConfig)
export default config

export const screens = config.theme.screens as TailwindThemeValue as Record<string, string>
