import Hero from 'components/Hero/Hero'
import FeaturedListings from 'Routes/Home/FeaturedListings'

const Home = () => {
    return (
        <main className='w-full pb-32'>
            <Hero />
            <FeaturedListings />
        </main>
    )
}

export default Home
