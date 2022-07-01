import Link from 'next/link'
import React from 'react'
import { InfoCard } from './InfoCard/InfoCard'

export const CreateAccountInformation = () => (
    <div className='max-w-2xl lg:max-w-md mx-auto lg:mx-0 '>
        <h4 className='mb-4'>
            Skapa ett konto utan kostnad idag och få tillgång till följande funktioner:
        </h4>
        <ul className='space-y-8 '>
            <InfoCard
                className='bg-primary text-white'
                heading={<span className='text-white'>Bevaka sökningar</span>}
                body='Skapa bevakningar och få notiser vid sökningar som matchar dina filter. Var den första som hittar de bästa produkterna för de bästa priserna'
            />

            <InfoCard
                className='bg-primary text-white'
                heading={<span className='text-white'>Spara produkter</span>}
                body={
                    <>
                        Hitta produkter du gillar och spara dem för senare. Dina gillade artiklar
                        hittar du under{' '}
                        <Link href='/minasidor/gillade'>
                            <a className='text-secondary'>Mina Sidor</a>
                        </Link>
                        .
                    </>
                }
            />
        </ul>
    </div>
)
