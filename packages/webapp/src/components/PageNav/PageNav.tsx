import React, { MutableRefObject } from 'react'
import NavEndButton from './NavEndButton/NavEndButton'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import config from 'config'
import { useAppSelector } from 'hooks/hooks'
import { useDispatch } from 'react-redux'
import { goToPage } from 'store/search/creators'

interface PageNavProps {
    anchorEle?: MutableRefObject<HTMLDivElement | null>
}

const PageNav = ({ anchorEle }: PageNavProps) => {
    const { totalHits, page } = useAppSelector((state) => state.search)
    const totalPages = Math.ceil(totalHits / config.searchLimit) || 1
    const dispatch = useDispatch()

    const RenderButtons = () => {
        const buttonList = []
        const maxNumButtons = 5

        const handleClick = (...args: Parameters<NavButtonProps['onClick']>) => {
            dispatch(goToPage(args[1]))
            anchorEle?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }

        const totalNumButtons = totalPages < 5 ? totalPages : maxNumButtons
        let startNum = 1

        if (page + 1 >= totalPages) {
            startNum = totalPages - totalNumButtons + 1
        } else if (page >= 3) {
            startNum = page - 2
        }

        for (let i = 0; i < totalNumButtons; i++) {
            let label = startNum + i
            if (totalNumButtons === maxNumButtons) {
                if (i === 0) {
                    label = 1
                } else if (i + 1 >= totalNumButtons) {
                    label = totalPages
                }
            }
            buttonList.push(
                <NavButton
                    key={startNum + i}
                    label={label}
                    selected={startNum + i === page}
                    onClick={handleClick}
                />
            )
        }
        return buttonList
    }

    const changePage = (increment: number) => {
        const newPage = page + increment
        if (newPage <= totalPages && newPage >= 1) {
            dispatch(goToPage(newPage))
        }
    }

    return (
        <div className='flex w-full max-w-full flex-wrap justify-center py-6' data-testid='pageNav'>
            <NavEndButton
                data-testid='pageNavPrev'
                onClick={() => changePage(-1)}
                icon={FiArrowLeft}
            />
            {RenderButtons()}
            <NavEndButton
                data-testid='pageNavNext'
                onClick={() => changePage(1)}
                icon={FiArrowRight}
            />
        </div>
    )
}

interface NavButtonProps {
    label: number
    selected: boolean
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => void
}

const NavButton = ({ label, selected, onClick }: NavButtonProps) => {
    return (
        <button
            className={`mx-2 h-12 w-12 transform shadow hover:scale-110 hover:shadow-md ${
                selected && 'border-b-2 border-black'
            }`}
            onClick={(e) => onClick(e, label)}
            data-testid={`pageNavButton`}
        >
            <span className='font-bold'>{label}</span>
        </button>
    )
}

export default PageNav
