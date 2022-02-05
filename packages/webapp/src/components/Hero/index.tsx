import MewiLogo from 'components/MewiLogo'
import SearchForm from 'components/SearchForm'
import Waves from './Waves'

const Hero = () => {
    return (
        <section>
            <div
                className='align-center flex justify-center bg-primary'
                style={{
                    minHeight: '40vh',
                }}
            >
                <div className='mx-auto flex max-w-lg flex-col items-center space-y-4 p-4 pt-16 lg:max-w-6xl lg:flex-row lg:justify-between lg:space-y-0 lg:space-x-4'>
                    <div className='flex w-full items-center justify-center'>
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
        <div className='flex w-full max-w-xl flex-none flex-col-reverse rounded-lg p-8 py-12 text-white lg:flex-col lg:border-2 lg:border-gray-200 lg:bg-white lg:text-black'>
            <h2 className='mb-4 text-center'>Hitta begagnade produkter på ett enda ställe</h2>
            <SearchForm />
        </div>
    )
}

Hero.SearchContainer = SearchContainer

export default Hero
