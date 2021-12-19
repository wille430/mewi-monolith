import { useContext } from 'react';
import { SearchContext } from 'common/context/SearchContext';
import NavEndButton from './NavEndButton';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import usePage from 'common/hooks/usePage';
import config from 'config';

interface Props {
    label: number,
    selected: boolean,
    onClick: Function
}

const PageNav = () => {

    const { search } = useContext(SearchContext)

    const { page, setPage } = usePage()
    const totalPages = Math.ceil(search.totalHits / config.searchLimit) || 1

    const RenderButtons = () => {
        const buttonList = []
        const maxNumButtons = 5

        const handleClick = (e: Event, pageNum: number) => {
            setPage(pageNum)
        }

        let totalNumButtons = totalPages < 5 ? totalPages : maxNumButtons
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
                <NavButton key={startNum + i} label={label} selected={startNum + i === page} onClick={handleClick} />
            )
        }
        return buttonList
    }

    const changePage = (increment: number) => {
        const newPage = page + increment
        if (newPage <= totalPages && newPage >= 1) {
            setPage(newPage)
        }
    }

    return (

        <div className="w-full flex justify-center py-6 max-w-full flex-wrap">
            <NavEndButton onClick={() => changePage(-1)} icon={FiArrowLeft} />
            {RenderButtons()}
            <NavEndButton onClick={() => changePage(1)} icon={FiArrowRight} />
        </div>
    );
}

const NavButton = ({ label, selected, onClick }: Props) => {

    return (
        <button className={`w-12 h-12 shadow mx-2 transform hover:shadow-md hover:scale-110 ${selected && 'border-b-2 border-black'}`} onClick={e => onClick(e, label)}>
            <span className="font-bold">
                {label}
            </span>
        </button>
    )
}

export default PageNav;