import type { Category } from '@/common/schemas'
import { CategoryLabel } from '@/common/schemas'
import Link from 'next/link'
import styles from './CategoryPathLabel.module.scss'

export const CategoryPathLabel = ({ category }: { category: Category }) => (
    <span className={styles.categoryLinks}>
        <Link href='/apps/next-client/src/pages/sok'>Allt</Link>
        <Link href={'/sok?categories=' + category}>{CategoryLabel[category]}</Link>
    </span>
)
