import Link from 'next/link'
import React from 'react'
import { AiFillHeart } from 'react-icons/ai'
import { GiMagnifyingGlass } from 'react-icons/gi'
import { InfoCard } from './InfoCard/InfoCard'

export const CreateAccountInformation = () => (
    <div className='bg-primary'>
        <div className='mx-auto max-w-2xl py-16 px-6 lg:mx-0 lg:max-w-md'>
            <h4 className='mb-4 text-white'>
                Skapa ett konto utan kostnad idag och få tillgång till följande funktioner:
            </h4>
            <ul className='space-y-8 '>
                <InfoCard
                    heading={
                        <>
                            <GiMagnifyingGlass className='mr-2 inline' />
                            Bevaka sökningar
                        </>
                    }
                    body='Skapa bevakningar och få notiser vid sökningar som matchar dina filter. Var den första som hittar de bästa produkterna för de bästa priserna'
                />

                <InfoCard
                    heading={
                        <>
                            <AiFillHeart className='mr-2 inline' />
                            Spara produkter
                        </>
                    }
                    body={
                        <>
                            Hitta produkter du gillar och spara dem för senare. Dina gillade
                            artiklar hittar du under{' '}
                            <Link href='/minasidor/gillade'>
                                <span className='text-secondary'>Mina Sidor</span>
                            </Link>
                            .
                        </>
                    }
                />
            </ul>
        </div>
    </div>
)
