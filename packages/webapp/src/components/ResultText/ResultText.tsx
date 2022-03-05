import { useAppSelector } from 'hooks/hooks'
import { useEffect, useState } from 'react'

const ResultText = () => {
    const { hits, totalHits, filters } = useAppSelector((state) => state.search)

    const [keyword, setKeyword] = useState('')

    useEffect(() => {
        setKeyword(filters.keyword || '')
    }, [hits])

    let resultString = ''

    if (totalHits >= 10000) {
        resultString += `Hittade över ${totalHits || 0} resultat`
    } else {
        resultString += `Hittade ${totalHits || 0} resultat`
    }
    if (filters.keyword) {
        resultString += ` för "${keyword}"`
    }

    return <span className='w-full text-sm text-gray-600'>{resultString}</span>
}

export default ResultText
