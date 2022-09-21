import { Category } from '@mewi/prisma/index-browser'
import { CategoryLabel } from '@wille430/common'
import Link from 'next/link'
import styles from './CategoryPathLabel.module.scss'

export const CategoryPathLabel = ({ category }: { category: Category }) => (
    <span className={styles.categoryLinks}>
        <Link href='/sok'>Allt</Link>
        <Link href={'/sok?categories=' + category}>{CategoryLabel[category]}</Link>
    </span>
)
