import faker from '@faker-js/faker'
import { ItemData, PublicWatcher } from '@mewi/types'
import UserModel from 'models/UserModel'
import mongoose from 'mongoose'
import WatcherNotificationService from './WatcherNotificationService'
import EmailService from './EmailService'
import * as mockingoose from 'mockingoose'
import { generateMockItemData } from '@mewi/util'
import ListingModel from 'models/ListingModel'

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

describe('Watcher Notification Service', () => {
    let mockItem: ItemData
    let sendEmailMock

    beforeEach(() => {
        mockItem = generateMockItemData() as ItemData
        ListingModel.find = jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue([mockItem]),
            count: jest.fn().mockResolvedValue(1),
        })

        // Mock EmailService
        sendEmailMock = jest.fn(() => {
            console.log('SENDING EMAIL...')
            return Promise.resolve({})
        })
        EmailService.sendEmail = sendEmailMock

        // Mock mongoose
        mockingoose(UserModel).toReturn({}, 'save')
    })

    it('should only notify if last notification was mote than 24 hours ago', () => {
        const startDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        const endDate = new Date()

        const dates: Date[] = new Array(10).fill(randomDate(startDate, endDate))

        for (const date of dates) {
            const shouldBeNotified = WatcherNotificationService.userShouldBeNotified(date)

            if (Date.now() - date.getTime() > 1.5 * 24 * 60 * 60 * 1000) {
                expect(shouldBeNotified).toBe(true)
            } else {
                expect(shouldBeNotified).toBe(false)
            }
        }
    })

    it('should notify user', async () => {
        const watcherId = new mongoose.Types.ObjectId()
        const userId = new mongoose.Types.ObjectId()
        const creationDate = faker.date.past(1).toString()

        const userWatcher = {
            _id: watcherId,
            createdAt: creationDate,
            updatedAt: creationDate,
            notifiedAt: null,
        }

        const user = new UserModel({
            email: `${faker.name.findName()}.${faker.name.lastName()}@${faker.internet.domainName()}`,
            password: faker.internet.password(),
            premium: false,
            watchers: [userWatcher],
        })

        const watcher: PublicWatcher = {
            _id: watcherId,
            metadata: { keyword: faker.random.word() },
            users: [new mongoose.Types.ObjectId(userId)],
            createdAt: creationDate,
        }

        const callback = jest.fn(() => console.log('Callback called!'))

        await WatcherNotificationService.notifyUser(user, watcher, callback)

        expect(sendEmailMock).toBeCalledTimes(1)
        expect(callback).toBeCalledTimes(1)

        expect(user.watchers[0].notifiedAt).toBeTruthy()
    })
})
