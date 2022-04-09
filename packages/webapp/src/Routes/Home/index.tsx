import Hero from 'components/Hero/Hero'
import FeaturedListings from 'Routes/Home/FeaturedListings/FeaturedListings'
import ItemPopUp from 'components/ItemPopUp/ItemPopUp'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { useEffect } from 'react'
import { checkSuccessParam } from 'store/snackbar/creators'
import { useHistory } from 'react-router'

const Home = () => {
    const dispatch = useAppDispatch()
    const routerState = useAppSelector((state) => state.router)
    const history = useHistory()

    useEffect(() => {
        const snackbar = dispatch(checkSuccessParam()).payload

        if (snackbar) {
            const currentParams = new URLSearchParams(routerState.location.search)
            currentParams.delete('success')

            history.replace('/?' + currentParams.toString())
        }
    }, [])

    return (
        <main className='w-full pb-32'>
            <Hero />
            <FeaturedListings />
            <ItemPopUp />
        </main>
    )
}

export default Home
