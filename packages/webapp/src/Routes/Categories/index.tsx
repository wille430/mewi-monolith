import { Container } from '@mewi/ui'
import CategoryList from './CategoryList'

const Categories = () => {
    return (
        <div className='layout'>
            <main className='main pb-32'>
                <Container>
                    <h3 className='pb-0 p-4'>Kategorier</h3>
                    <CategoryList />
                    <div className='pb-8'/>
                </Container>
            </main>
        </div>
    )
}

export default Categories
