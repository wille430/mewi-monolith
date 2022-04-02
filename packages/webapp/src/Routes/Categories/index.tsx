import CategoryList from './CategoryList'

const Categories = () => {
    return (
        <div className='layout'>
            <main className='main pb-32'>
                <section className='max-w-lg mx-auto'>
                    <h3 className='pb-6'>Kategorier</h3>
                    <CategoryList />
                </section>
            </main>
        </div>
    )
}

export default Categories
