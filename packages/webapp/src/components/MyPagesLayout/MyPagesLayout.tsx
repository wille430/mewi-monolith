import { ReactElement } from 'react'
import styles from './MyPagesLayout.module.scss'
import { Layout } from '../Layout/Layout'
import SideNav from '../SideNav/SideNav'

export const MyAccountLayout = ({ children }: { children: ReactElement }) => {
    return (
        <Layout>
            <div className={styles.grid}>
                <aside></aside>
                <div className={styles.content}>{children}</div>
                <aside>
                    <div className='lg:w-56'>
                        <SideNav />
                    </div>
                </aside>
            </div>
        </Layout>
    )
}
