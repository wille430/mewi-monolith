import { useAppSelector } from 'hooks/hooks'

const ResultText = () => {
    const { totalHits, filters } = useAppSelector((state) => state.search)

    let resultString = ''

    if (totalHits >= 10000) {
        resultString += `Hittade över ${totalHits || 0} resultat`
    } else {
        resultString += `Hittade ${totalHits || 0} resultat`
    }
    if (filters.keyword) {
        resultString += ` för "${filters.keyword}"`
    }

    return <span className='w-full text-sm text-gray-600'>{resultString}</span>
}

export default ResultText
