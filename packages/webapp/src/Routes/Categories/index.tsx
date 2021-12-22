import CategoryList from './CategoryList'

const Categories = () => {
    return (
        <div className='layout'>
            <main className='main'>
                <section>
                    <h1 className='text-2xl pb-6'>Kategorier</h1>
                    <CategoryList />
                </section>
            </main>
        </div>
    )
}

export default Categories
