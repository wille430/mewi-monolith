import { CategoryLabel } from '@wille430/common'
import { Category } from '@mewi/prisma/index-browser'
import classNames from 'classnames'
import styles from './CategorySideNav.module.scss'
import Link from 'next/link'
import { Container, ContainerProps } from '@mewi/ui'

export interface CategorySideNavProps extends ContainerProps {
    selectedCategory?: Category
}

export const CategorySideNav = ({ selectedCategory, ...rest }: CategorySideNavProps) => {
    const isSelected = (key: Category) => {
        return selectedCategory === key
    }

    return (
        <Container
            className={classNames({
                [styles.container]: true,
                [rest.className]: true,
            })}
            {...rest}
        >
            <Container.Header>
                <h4 className='mb-2'>Kategorier</h4>
            </Container.Header>
            <Container.Content>
                <ul>
                    {Object.keys(Category).map((key) => (
                        <li
                            key={key}
                            className={classNames({
                                [styles.selected]: isSelected(key),
                            })}
                        >
                            <Link href={`/kategorier/${key.toLowerCase()}`}>
                                {CategoryLabel[key]}
                            </Link>
                        </li>
                    ))}
                </ul>
            </Container.Content>
        </Container>
    )
}
