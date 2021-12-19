
const RedirectButton = ({href}) => {

    const onClick = () => {
        window.open(href, '_blank')
    }

    return (
        <button className="button" onClick={onClick}>{"Till artikeln"}</button>
    );
}
 
export default RedirectButton;