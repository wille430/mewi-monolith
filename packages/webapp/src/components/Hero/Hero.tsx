import style from './Hero.module.scss'
import { SearchInput } from '@/components/SearchInput/SearchInput'

export const Hero = () => {
    return (
        <section className={style.hero}>
            <div className={style['inner-hero']}>
                <div className={style['logo-wrapper']}>
                    <img className={style.logo} src='/img/logo.png' alt='Mewi Logo' />
                </div>
                <div className={style['search-box']}>
                    <h3>Hitta begagnade produkter på ett enda ställe</h3>
                    <SearchInput data-testid='search-input' />
                </div>
            </div>
        </section>
    )
}
