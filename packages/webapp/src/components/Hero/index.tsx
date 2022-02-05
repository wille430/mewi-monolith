import MewiLogo from 'components/MewiLogo'
import SearchForm from 'components/SearchForm'
import Waves from './Waves'

const Hero = () => {
    return (
        <section>
            <div
                className='bg-primary flex justify-center align-center'
                style={{
                    minHeight: '40vh',
                }}
            >
                <div className='max-w-lg lg:max-w-6xl p-4 mx-auto pt-16 flex lg:flex-row flex-col space-y-4 lg:space-y-0 lg:space-x-4 items-center lg:justify-between'>
                    <div className='w-full flex justify-center items-center'>
                        <figure className='h-32 lg:h-44'>
                            <MewiLogo />
                        </figure>
                    </div>
                    <Hero.SearchContainer />
                </div>
            </div>
            <Waves />
        </section>
    )
}

const SearchContainer = () => {
    return (
            <div className='lg:bg-white lg:border-gray-200 lg:border-2 rounded-lg p-8 py-12 text-white lg:text-black flex lg:flex-col flex-col-reverse w-full max-w-xl flex-none'>
                <h2 className='text-center mb-4'>Hitta begagnade produkter på ett enda ställe</h2>
                <SearchForm />
            </div>
    )
}

Hero.SearchContainer = SearchContainer

export default Hero
