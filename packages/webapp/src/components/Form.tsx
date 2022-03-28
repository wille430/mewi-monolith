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
            className='w-full rounded-md bg-blue p-4 pt-6 text-white'
            style={{
                maxWidth: '400px',
            }}
        >
            <h3 className='text-center'>{title}</h3>
            <div>
                <form
                    className='mx-auto flex flex-col p-4'
                    onSubmit={onFormSubmit}
                    style={{
                        maxWidth: '300px',
                    }}
                >
                    {children}
                    <div className='flex justify-center pt-4'>
                        <button
                            className='rounded-sm bg-green p-2 px-6 text-sm text-black'
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
