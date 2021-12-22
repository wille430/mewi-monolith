import { ReactNode } from 'react'
import { Transition, TransitionStatus } from 'react-transition-group'

const transitions = {
    entering: {
        transform: 'translateX(-120%)',
        opacity: 1,
    },
    entered: {
        transform: 'translateX(0%)',
        opacity: 1,
    },
    exiting: {
        transform: 'translateX(-120%)',
        opacity: 1,
    },
    exited: {
        transform: 'translateX(-120%)',
        opacity: 0,
    },
}

export interface SlideTransitionProps {
    in: boolean
    duration?: number
    render: (state: TransitionStatus) => ReactNode
}

const SlideTransition = ({ in: inProp, duration = 500, render }: SlideTransitionProps) => {
    const defaultStyling = {
        transition: `all ${duration}ms ease-in-out`,
    }

    return (
        // @ts-ignore
        <Transition in={inProp} duration={duration}>
            {(state) => {
                return (
                    <div
                        style={{
                            ...defaultStyling,
                            // @ts-ignore
                            ...transitions[state],
                        }}
                    >
                        {render(state)}
                    </div>
                )
            }}
        </Transition>
    )
}

export default SlideTransition
