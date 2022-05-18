import { CategoryLabel } from '@wille430/common'
import { Category } from '@mewi/prisma/index-browser'
import classNames from 'classnames'
import Link from 'next/link'
import { Container, ContainerProps } from '@mewi/ui'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import _ from 'lodash'
import styles from './CategorySideNav.module.scss'

export interface CategorySideNavProps extends ContainerProps {
    selectedCategory?: Category
}

export const CategorySideNav = ({ selectedCategory, ...rest }: CategorySideNavProps) => {
    const router = useRouter()

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
                            <Link
                                href={`/kategorier/${key.toLowerCase()}?${queryString.stringify(
                                    _.omit(router.query, ['category', 'page'])
                                )}`}
                            >
                                {CategoryLabel[key]}
                            </Link>
                        </li>
                    ))}
                </ul>
            </Container.Content>
        </Container>
    )
}
