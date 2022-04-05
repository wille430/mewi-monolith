import searchApi from 'api/searchApi'
import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import AutoCompleteRow from '../AutoCompleteRow'
import styles from './SearchSuggestions.module.scss'
import classNames from 'classnames'
import { HTMLMotionProps, motion } from 'framer-motion'

const cx = classNames.bind(styles)

interface SearchSuggestionsProps extends HTMLMotionProps<'ul'> {
    query?: string
    show: boolean
    onAutoCompleteClick?: (newVal: string) => void
}

const SearchSuggestions = ({
    query,
    show,
    onAutoCompleteClick,
    ...props
}: SearchSuggestionsProps) => {
    const [suggestions, setSuggestions] = useState<string[]>([])

    const getSuggestions = useCallback(
        _.debounce((_query) => {
            if (!_query) {
                setSuggestions([])
            }

            searchApi.autocomplete(_query).then((v) => {
                setSuggestions(v)
            })
        }, 750),
        []
    )

    const animation = {
        animation: ({ show, i }: { show: boolean; i: number }) => ({
            display: 'block',
            height: show ? ['0%', '20%', '20%', `${i * 20}%`] : [`${i * 20}%`, '20%', '20%', '0%'],
            opacity: i > 0 ? (show ? [0, 1, 1, 1] : [1, 1, 1, 0]) : [0, 0, 0, 0],
            transitionEnd: {
                display: show ? 'block' : 'none',
            },
        }),
    }

    useEffect(() => {
        getSuggestions(query)

        return () => {
            getSuggestions.cancel()
        }
    }, [query])

    return (
        <div
            className={cx({
                [styles.container]: true,
            })}
        >
            <motion.ul
                variants={animation}
                custom={{ show, i: suggestions.length }}
                animate={'animation'}
                transition={{
                    duration: 0.5,
                    times: [0, 0.3, 0.32, 1],
                }}
                className={cx({
                    [styles.ul]: true,
                })}
                {...props}
            >
                {suggestions.map((suggestion, i) => (
                    <AutoCompleteRow
                        key={i}
                        keyword={suggestion}
                        onClick={() => onAutoCompleteClick && onAutoCompleteClick(suggestion)}
                    >
                        {suggestion}
                    </AutoCompleteRow>
                ))}
            </motion.ul>
        </div>
    )
}

export default SearchSuggestions
