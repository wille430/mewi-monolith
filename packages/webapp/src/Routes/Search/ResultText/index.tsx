import { useContext } from 'react'
import { SearchContext } from 'common/context/SearchContext'
import useParam from 'common/hooks/useParam'

const ResultText = () => {
    const { search } = useContext(SearchContext)
    const query = useParam('q')[0]

    let resultString = ''

    if (search.totalHits >= 10000) {
        resultString += `Hittade över ${search.totalHits || 0} resultat`
    } else {
        resultString += `Hittade ${search.totalHits || 0} resultat`
    }
    if (query) {
        resultString += ` för "${query}"`
    }

    return <span className='text-gray-600 text-sm w-full'>{resultString}</span>
}

export default ResultText
