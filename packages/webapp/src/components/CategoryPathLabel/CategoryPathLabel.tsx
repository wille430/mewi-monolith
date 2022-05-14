import { Category } from '@mewi/prisma'
import { CategoryLabel } from '@wille430/common'
import Link from 'next/link'
import styles from './CategoryPathLabel.module.scss'

export const CategoryPathLabel = ({ category }: { category: Category }) => (
    <span className={styles.categoryLinks}>
        <Link href='/sok'>Allt</Link>
        <Link href={'/kategorier/' + category.toLowerCase()}>{CategoryLabel[category]}</Link>
    </span>
)
