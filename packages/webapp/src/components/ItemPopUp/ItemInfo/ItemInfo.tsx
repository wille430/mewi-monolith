import RedirectButton from './RedirectButton/RedirectButton'
import ImageDisplay from '../../ImageDisplay/ImageDisplay'
import ParamInfo from './ParamInfo'
import CategoryString from './CategoryString'
import { IListing } from '@wille430/common/types'

const ItemInfo = ({ article }: { article: IListing }): JSX.Element => {
    const priceString = `${article.price?.value || ''} ${article.price?.currency || ''}`

    const InfoHeader = () => (
        <div className='flex-none bg-white pt-4'>
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
        <article className='flex-grow px-2 pb-12'>
            <h3 className='pb-1 font-light'>Beskrivning</h3>
            <div className='flex flex-col space-x-10 sm:flex-row'>
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
        <div className='flex h-full flex-col p-4 pt-0'>
            <CategoryString categories={article.category} />
            <div className='row-span-auto'>
                <ImageDisplay imageUrls={article.imageUrl} />
            </div>
            <section className='flex flex-grow flex-col pb-32 sm:pb-0'>
                <InfoHeader />
                <Description />
            </section>
        </div>
    )
}

export default ItemInfo
