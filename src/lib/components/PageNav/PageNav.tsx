import type { MutableRefObject, MouseEvent } from 'react'
import { memo, useMemo } from 'react'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import NavEndButton from './NavEndButton/NavEndButton'
import { useListingFilters } from '@/lib/hooks/useListingFilters'

interface PageNavProps {
    anchorEle?: MutableRefObject<HTMLDivElement | null>
    totalHits?: number
}

const PageNav = ({ anchorEle, totalHits = 0 }: PageNavProps) => {
    const { setFilters, filters } = useListingFilters()

    const totalPages = useMemo(() => Math.ceil(totalHits / 24) ?? 1, [totalHits])

    const scrollToAnchorEle = () =>
        anchorEle?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

    const RenderButtons = memo(() => {
        const maxNumButtons = 5

        const handleClick = (...args: Parameters<NavButtonProps['onClick']>) => {
            scrollToAnchorEle()
            setFilters((prev) => ({ ...prev, page: args[1] }), true)
        }

        const totalNumButtons = totalPages < 5 ? totalPages : maxNumButtons
        let startNum = 1

        if ((filters.page ?? 1) + 1 >= totalPages) {
            startNum = totalPages - totalNumButtons + 1
        } else if ((filters.page ?? 1) >= 3) {
            startNum = (filters.page ?? 1) - 2
        }

        const showFirstPageSkip = startNum > 1
        const showLastPageSkip = totalPages > startNum + maxNumButtons - 1

        if (!totalNumButtons) return null

        return (
            <>
                {Array(totalNumButtons)
                    .fill(startNum)
                    .map((num, i) => {
                        const currentNumber = num + i

                        if (i === totalNumButtons - 1 && showLastPageSkip) {
                            return (
                                <>
                                    <span key='dots-1' className='mx-2 mt-auto block'>
                                        ...
                                    </span>
                                    <NavButton
                                        key={totalPages}
                                        label={totalPages}
                                        selected={
                                            filters.page === totalPages ||
                                            (!filters.page && totalPages === 1)
                                        }
                                        onClick={handleClick}
                                    />
                                </>
                            )
                        } else if (i === 0 && showFirstPageSkip) {
                            return (
                                <>
                                    <NavButton
                                        key={1}
                                        label={1}
                                        selected={filters.page === 1 || !filters.page}
                                        onClick={handleClick}
                                    />
                                    <span key='dots-0' className='mx-2 mt-auto block'>
                                        ...
                                    </span>
                                </>
                            )
                        }
                        return (
                            <NavButton
                                key={currentNumber}
                                label={currentNumber}
                                selected={
                                    filters.page === currentNumber ||
                                    (!filters.page && currentNumber === 1)
                                }
                                onClick={handleClick}
                            />
                        )
                    })}
            </>
        )
    })
    RenderButtons.displayName = 'Buttons'

    const changePage = (increment: number) => {
        const newPage = filters.page ?? 1 + increment
        if (newPage <= totalPages && newPage >= 1) {
            scrollToAnchorEle()
            setFilters((prev) => ({ ...prev, page: newPage }), true)
        }
    }

    return (
        <div className='flex w-full max-w-full flex-wrap justify-center py-6' data-testid='pageNav'>
            <NavEndButton
                key='page-prev'
                data-testid='pageNavPrev'
                onClick={() => changePage(-1)}
                icon={<FiArrowLeft color='black' />}
            />
            <RenderButtons key='pages' />
            <NavEndButton
                key='page-next'
                data-testid='pageNavNext'
                onClick={() => changePage(1)}
                icon={<FiArrowRight color='black' />}
            />
        </div>
    )
}

interface NavButtonProps {
    label: number
    selected: boolean
    onClick: (e: MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => void
}

const NavButton = ({ label, selected, onClick }: NavButtonProps) => {
    return (
        <button
            className={`mx-2 h-12 w-12 transform shadow hover:scale-110 hover:shadow-md ${
                selected && 'border-b-2 border-black'
            }`}
            onClick={(e) => onClick(e as any, label)}
            data-testid={`pageNavButton`}
        >
            <span className='font-bold'>{label}</span>
        </button>
    )
}

export default PageNav