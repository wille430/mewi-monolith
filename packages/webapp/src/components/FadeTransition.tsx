import { ReactNode } from 'react'
import { Transition, TransitionStatus } from 'react-transition-group'

const transitions: Record<TransitionStatus, Record<string, string | number>> = {
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
    unmounted: {},
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
        <Transition
            in={inProp}
            duration={duration}
            addEndListener={(node, done) =>
                node.addEventListener('transitionend', (e) => undefined)
            }
        >
            {(state) => {
                return (
                    <div
                        style={{
                            ...defaultStyling,
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
