import CategoryList from './CategoryList'

const Categories = () => {
    return (
        <div className='layout'>
            <main className='main'>
                <section>
                    <h3 className='pb-6'>Kategorier</h3>
                    <CategoryList />
                </section>
            </main>
        </div>
    )
}

export default Categories
