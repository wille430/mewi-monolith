import * as React from 'react'

interface Props {
    onFormSubmit: React.FormEventHandler<HTMLFormElement>
    children: any
    buttonLabel: string
    title: string
    footer?: React.ReactElement[]
}

const Form = ({ onFormSubmit, buttonLabel, title, children, footer }: Props) => {
    return (
        <section
            className='bg-blue text-white p-4 pt-6 rounded-md w-full'
            style={{
                maxWidth: '400px',
            }}
        >
            <h2 className='text-center text-xl'>{title}</h2>
            <div>
                <form
                    className='flex flex-col mx-auto p-4'
                    onSubmit={onFormSubmit}
                    style={{
                        maxWidth: '300px',
                    }}
                >
                    {children}
                    <div className='flex justify-center pt-4'>
                        <button
                            className='text-sm text-black p-2 rounded-sm bg-green px-6'
                            type='submit'
                            data-testid='formSubmitButton'
                        >
                            {buttonLabel}
                        </button>
                    </div>
                </form>
                <footer>{footer}</footer>
            </div>
        </section>
    )
}

export default Form
