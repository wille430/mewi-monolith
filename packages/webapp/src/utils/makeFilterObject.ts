const makeFilterObject = (value: string, label: string) => {
    return { value: value.toLowerCase(), label: label }
}

export default makeFilterObject
