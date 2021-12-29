import Snackbar from './index'
import '@testing-library/jest-dom'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { randomString } from '@mewi/util'

const testIds = {
    snackbar: 'snackbarContainer',
    closeButton: 'closeSnackbar',
    title: 'snackbarTitle',
    body: 'snackbarText',
}

describe('Snackbar', () => {
    let title = ''
    let body = ''

    beforeEach(() => {
        title = randomString(8)
        body = randomString(8)
        jest.useFakeTimers()
        cleanup()
    })

    it('should render correctly', () => {
        const { queryByTestId } = render(<Snackbar />)

        expect(queryByTestId(testIds.snackbar)).toBeTruthy()
        expect(queryByTestId(testIds.closeButton)).toBeTruthy()
        expect(queryByTestId(testIds.title)).toBeTruthy()
        expect(queryByTestId(testIds.body)).toBeTruthy()
    })

    describe('displays content', () => {
        const { queryByTestId, queryAllByText } = render(
            <Snackbar open={true} title={title} body={body} />
        )
        const snackbar = queryByTestId(testIds.snackbar)

        expect(queryAllByText(title)).toBeTruthy()
        expect(queryAllByText(body)).toBeTruthy()
    })

    describe('is hidden when', () => {
        it('open is false', () => {
            const { queryByTestId } = render(<Snackbar open={false} />)
            const snackbar = queryByTestId(testIds.snackbar)

            setTimeout(() => {
                expect(snackbar).not.toBeVisible()
            }, 100)
        })
    })

    describe('is not hidden when', () => {
        it('open is true', () => {
            const { queryByTestId } = render(<Snackbar open={true} />)
            const snackbar = queryByTestId(testIds.snackbar)

            setTimeout(() => {
                expect(snackbar).toBeVisible()
            }, 100)

            jest.runAllTimers()
        })
    })

    describe('callbacks when', () => {
        let callback: jest.Mock

        beforeEach(() => {
            callback = jest.fn()
        })

        it('close button is pressed', () => {
            const { queryByTestId } = render(
                <Snackbar open={true} title={title} handleClose={callback} />
            )

            const button = queryByTestId(testIds.closeButton)
            if (!button) fail()

            fireEvent.click(button)

            expect(callback).toHaveBeenCalled()
        })

        it('it times out', async () => {
            const timeout = 5000

            render(
                <Snackbar
                    open={true}
                    title={title}
                    autoHideDuration={timeout}
                    handleClose={callback}
                />
            )

            new Promise<void>((resolve) =>
                setTimeout(() => {
                    expect(callback).toHaveBeenCalledTimes(1)
                    resolve()
                }, timeout + 100)
            )

            jest.runAllTimers()
        })
    })

    describe('hides when', () => {
        it('callback is called', () => {
            let open = true
            const animationDuration = 0

            const callback = jest.fn(() => {
                open = false
            })

            const { queryByTestId, rerender } = render(
                <Snackbar
                    open={open}
                    title={title}
                    handleClose={callback}
                    animationDuration={animationDuration}
                />
            )
            const snackbar = queryByTestId(testIds.snackbar)

            new Promise<void>((resolve) =>
                setTimeout(() => {
                    expect(snackbar).toBeVisible()
                    resolve()
                }, 0)
            )

            jest.runAllTimers()

            const button = queryByTestId(testIds.closeButton)
            if (!button) fail()

            fireEvent.click(button)

            rerender(
                <Snackbar
                    open={open}
                    title={title}
                    handleClose={callback}
                    animationDuration={animationDuration}
                />
            )
            expect(snackbar).toBeVisible()

            new Promise<void>((resolve) =>
                setTimeout(() => {
                    expect(snackbar).not.toBeVisible()
                    resolve()
                }, animationDuration)
            )

            jest.runAllTimers()
        })
    })
})
