import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AutoCompleteRowProps {
    children: ReactNode | string,
    keyword: string
}

const AutoCompleteRow = ({ children, keyword }: AutoCompleteRowProps) => {
    return (
        <Link to={`/search?q=${keyword}`} className="block w-full bg-white z-50 px-4 py-1.5 hover:bg-gray-300 cursor-pointer">
            {children}
        </Link>
    );
}

export default AutoCompleteRow;