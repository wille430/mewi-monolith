import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config'

export const useTailwind = () => {
    const config = resolveConfig(tailwindConfig)

    return config.theme
}
