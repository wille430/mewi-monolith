import SearchForm from 'components/SearchForm/index'
import logo from 'assets/logo.png'
import BigWaves from './Waves/BigWaves'
import SmallWaves from './Waves/SmallWaves'
import * as styles from './style'
import MewiLogo from 'components/MewiLogo'
import Layout from 'components/Layout'

const Home = () => {
    return (
        <Layout>
            <main className='main min-w-full h-full p-0'>
                <styles.Wrapper>
                    <div
                        className='bg-blue flex flex-col items-center justify-end'
                        style={{
                            minHeight: '45vh',
                        }}
                    >
                        <div
                            className='w-full flex flex-col items-center lg:flex-row lg:items-center lg:justify-between px-8'
                            style={{
                                maxWidth: '1200px',
                            }}
                        >
                            <div className='flex-shrink-1 mx-auto pt-16 lg:pt-0'>
                                <figure className='h-32 lg:h-44'>
                                    <MewiLogo src={logo} size='large' />
                                </figure>
                            </div>
                            <div className='pb-6 flex-shrink max-w-xl'>
                                <div className='bg-transparent lg:bg-white px-6 py-12 pb-16 rounded-xl flex flex-col-reverse lg:flex-col'>
                                    <h2 className='text-center text-white lg:text-primary pb-4'>
                                        Hitta begagnade produkter på ett enda ställe
                                    </h2>
                                    <styles.SearchBarWrapper>
                                        <SearchForm />
                                    </styles.SearchBarWrapper>
                                </div>
                            </div>
                        </div>
                    </div>
                    <BigWaves />
                    <SmallWaves />
                    <div
                        style={{
                            height: 'calc(15% + 50px)',
                        }}
                    />
                </styles.Wrapper>
            </main>
        </Layout>
    )
}

export default Home
