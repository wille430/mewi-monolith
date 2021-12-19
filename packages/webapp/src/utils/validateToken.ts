const validateToken = async (token: string | null): Promise<boolean> => {
    try {
        if (!token) return false

        // Validate token in API
        const response = await fetch(process.env.NX_API_URL + '/user/validateToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token })
        })

        // Return true if valid
        if (response.status === 200) return true
        return false
    } catch (e) {
        return false
    }
}

export default validateToken