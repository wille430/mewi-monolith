import Hero from 'components/Hero/Hero'
import FeaturedListings from 'Routes/Home/FeaturedListings/FeaturedListings'
import ItemPopUp from 'components/ItemPopUp/ItemPopUp'

const Home = () => {
    return (
        <main className='w-full pb-32'>
            <Hero />
            <FeaturedListings />
            <ItemPopUp />
        </main>
    )
}

export default Home
