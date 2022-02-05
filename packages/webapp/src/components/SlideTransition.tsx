import { ReactNode, useEffect, useRef, useState } from 'react'
import { Transition, TransitionStatus } from 'react-transition-group'

const transitions: Record<TransitionStatus, Record<string, string | number>> = {
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
    unmounted: {},
}

export interface SlideTransitionProps {
    in: boolean
    duration?: number
    render: (state: TransitionStatus) => ReactNode
    onExited?: () => void
    onEntered?: () => void
    onEntering?: () => void
    onExiting?: () => void
    runOnStart?: boolean
}

const SlideTransition = ({
    in: inProp,
    duration = 500,
    render,
    onEntering,
    onEntered,
    onExiting,
    onExited,
    runOnStart,
}: SlideTransitionProps) => {
    const defaultStyling = {
        transition: `all ${duration}ms ease-in-out`,
    }

    const [show, setShow] = useState(false)
    const [isExiting, setIsExiting] = useState(false)

    const onExitedTimerRef = useRef<any | null>()

    useEffect(() => {
        setShow(inProp)
    }, [inProp])

    return (
        <Transition
            in={runOnStart ? show : inProp}
            duration={duration}
            addEndListener={(node, done) =>
                node.addEventListener('transitionend', () => undefined)
            }
        >
            {(state: TransitionStatus) => {
                if (state === 'entering') {
                    onEntering && onEntering()
                } else if (state === 'entered') {
                    onEntered && onEntered()
                } else if (state === 'exiting') {
                    setIsExiting(true)
                    onExiting && onExiting()
                } else if (state === 'exited' && isExiting) {
                    clearTimeout(onExitedTimerRef.current)
                    onExitedTimerRef.current = setTimeout(() => {
                        onExited && onExited()
                    }, duration)
                }

                return (
                    <div
                        style={{
                            ...defaultStyling,
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
