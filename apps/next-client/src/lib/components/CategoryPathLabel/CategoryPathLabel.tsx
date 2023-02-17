import {CategoryLabel, Category} from '@mewi/models'
import Link from 'next/link'
import styles from './CategoryPathLabel.module.scss'

export const CategoryPathLabel = ({category}: { category: Category }) => (
    <span className={styles.categoryLinks}>
        <Link href="/sok">Allt</Link>
        <Link href={'/sok?categories=' + category}>{CategoryLabel[category]}</Link>
    </span>
)
