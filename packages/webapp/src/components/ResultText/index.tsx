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

    return <span className='text-gray-600 text-sm w-full'>{resultString}</span>
}

export default ResultText