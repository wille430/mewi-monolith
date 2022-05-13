interface ListingResultTextProps {
    totalHits: number
}

export const ListingResultText = ({ totalHits = 0 }: ListingResultTextProps) => {
    if (totalHits === 0) {
        return <div />
    } else if (totalHits > 0) {
        return <span>Hittade {totalHits} resultat</span>
    } else {
        return <div />
    }
}
