import {BiChevronDown, BiChevronUp} from "react-icons/bi";
import {Button} from "@/components/Button/Button";

interface ExpandedButtonProps {
    handleExpand: () => void
    expand: boolean
}

const ExpandButton = ({handleExpand, expand}: ExpandedButtonProps) => {
    return (
        <Button
            onClick={handleExpand}
            className="text-black bg-transparent"
        >
            {expand ? <BiChevronUp size={24}/> : <BiChevronDown size={24}/>}
        </Button>
    );
};

export default ExpandButton;
