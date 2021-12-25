import React from 'react'

const ParamInfo = ({ paramObj }: { paramObj: any }) => {
    if (!paramObj) return <></>
    return (
        <section
            style={{
                width: '180px',
            }}
        >
            {paramObj.map((param: any, i: number) => (
                <article key={i} className='flex items-center space-x-2'>
                    <h4>{param.label}:</h4>
                    <p className='text-gray-800 text-sm'>{param.value}</p>
                </article>
            ))}
        </section>
    )
}

export default ParamInfo
