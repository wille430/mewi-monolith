import RedirectButton from './RedirectButton'
import ImageDisplay from './ImageDisplay'
import ParamInfo from './ParamInfo'
import { ItemData } from 'models/types'
import CategoryString from './CategoryString'

const ItemInfo = ({ article }: { article: ItemData }): JSX.Element => {
    const priceString = `${article.price.value || ''} ${article.price.currency || ''}`

    const InfoHeader = () => (
        <div className='pt-4 bg-white flex-none'>
            <span className='text-sm font-light'>{article.origin || ''}</span>
            <div className='flex justify-between'>
                <div>
                    <h2>{article.title}</h2>
                    <span className='text-sm font-light'>{article.region || ''}</span>
                </div>
                <div className='flex flex-col'>
                    <RedirectButton href={article.redirectUrl} />
                    <span className='text-lg font-semibold'>{priceString}</span>
                </div>
            </div>
            <hr className='opacity-60' />
        </div>
    )

    const Description = () => (
        <article className='px-2 flex-grow pb-12'>
            <h3 className='pb-1 font-light'>Beskrivning</h3>
            <div className='flex flex-col sm:flex-row space-x-10'>
                <div className='flex-grow'>
                    {article.body && (
                        <p>
                            {article.body.split('\n').map((x) => (
                                <>
                                    {x}
                                    <br />
                                </>
                            ))}
                        </p>
                    )}
                </div>
                <div className='flex'>
                    <ParamInfo paramObj={article.parameters} />
                </div>
            </div>
        </article>
    )

    return (
        <div className='h-full flex flex-col p-4 pt-0'>
            <CategoryString categories={article.category} />
            <div className='row-span-auto'>
                <ImageDisplay imageUrls={article.imageUrl} />
            </div>
            <section className='flex-grow flex flex-col sm:pb-0 pb-32'>
                <InfoHeader />
                <Description />
            </section>
        </div>
    )
}

export default ItemInfo
