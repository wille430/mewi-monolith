import { ReactNode } from 'react'
import { Transition } from 'react-transition-group'

const transitions = {
    entering: {
        opacity: 0,
    },
    entered: {
        opacity: 1,
    },
    exiting: {
        opacity: 1,
    },
    exited: {
        opacity: 0,
    },
}

export interface FadeTransitionProps {
    in: boolean
    duration?: number
    children: ReactNode
}

const FadeTransition = ({ in: inProp, duration = 300, children }: FadeTransitionProps) => {
    const defaultStyling = {
        transition: `opacity ${duration}ms ease-in-out`,
        opacity: 0,
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
                        {children}
                    </div>
                )
            }}
        </Transition>
    )
}

export default FadeTransition
