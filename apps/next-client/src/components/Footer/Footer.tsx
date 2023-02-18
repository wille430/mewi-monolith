"use client"
import Link from 'next/link'
import styles from './Footer.module.scss'
import clsx from "clsx"
import {Category, CategoryLabel} from "@mewi/models"

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={clsx(styles['inner-footer'], "container px-2")}>
                <ul className={styles['link-list']}>
                    <li>
                        <Link href="/">Hem</Link>
                    </li>
                    <li>
                        <Link href="/apps/next-client/src/pages/loggain">Logga in</Link>
                    </li>
                    <li>
                        <Link href="/apps/next-client/src/pages/nyttkonto">Skapa ett konto</Link>
                    </li>
                </ul>
                <ul className={styles['link-list']}>
                    <li>
                        <Link href="/kategorier">Alla kategorier</Link>
                    </li>
                    <ul className="grid gap-3 md:grid-cols-2">
                        {Object.keys(Category).map((key) => (
                            <li key={key} className="text-sm">
                                <Link href={`/sok?categories=/${key}`}>
                                    {CategoryLabel[key as Category]}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </ul>
                <ul className={styles['link-list']}>
                    <li>
                        <Link href="/minasidor/bevakningar">Mina sidor</Link>
                    </li>
                    <li>
                        <Link href="/minasidor/bevakningar">Bevakningar</Link>
                    </li>
                    <li>
                        <Link href="/minasidor/konto">Konto</Link>
                    </li>
                </ul>
            </div>
        </footer>
    )
}
