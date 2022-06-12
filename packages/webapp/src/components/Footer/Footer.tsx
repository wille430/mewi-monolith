import { Category } from '@mewi/prisma/index-browser'
import { CategoryLabel } from '@wille430/common'
import Link from 'next/link'
import styles from './Footer.module.scss'
import NavCurve from '../Nav/NavCurve'

export const Footer = () => {
    return (
        <div>
            <div className='rotate-180'>
                <NavCurve />
            </div>
            <footer className={styles.footer}>
                <div className={styles['inner-footer']}>
                    <div>
                        <ul className={styles['link-list']}>
                            <li>
                                <Link href='/'>Hem</Link>
                            </li>
                            <li>
                                <Link href='/loggain'>Logga in</Link>
                            </li>
                            <li>
                                <Link href='/nyttkonto'>Skapa ett konto</Link>
                            </li>
                        </ul>
                        <ul className={styles['link-list']}>
                            <li>
                                <Link href='/kategorier'>Alla kategorier</Link>
                            </li>
                            <ul className='grid gap-3 md:grid-cols-2'>
                                {Object.keys(Category).map((key) => (
                                    <li key={key} className='text-sm'>
                                        <Link href={`/kategorier/${key.toLowerCase()}`}>
                                            {CategoryLabel[key as Category]}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </ul>
                        <ul className={styles['link-list']}>
                            <li>
                                <Link href='/minasidor'>Mina sidor</Link>
                            </li>
                            <li>
                                <Link href='/minasidor/bevakningar'>Bevakningar</Link>
                            </li>
                            <li>
                                <Link href='/minasidor/konto'>Konto</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    )
}