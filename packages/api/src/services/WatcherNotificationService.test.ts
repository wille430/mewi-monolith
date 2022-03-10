import { Client } from '@elastic/elasticsearch'
import faker from '@faker-js/faker'
import { ItemData, PublicWatcher } from '@mewi/types'
import UserModel from 'models/UserModel'
import mongoose from 'mongoose'
import WatcherNotificationService from './WatcherNotificationService'
import Mock from '@elastic/elasticsearch-mock'
import Elasticsearch from 'config/elasticsearch'
import EmailService from './EmailService'
import * as mockingoose from 'mockingoose'
import { generateMockItemData } from '@mewi/util'

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

describe('Watcher Notification Service', () => {
    let mock
    let client
    let mockItem: ItemData
    let sendEmailMock

    beforeEach(() => {
        // Mock elasticSearch
        mock = new Mock()
        client = new Client({
            node: 'http://localhost:9200',
            Connection: mock.getConnection(),
        })

        mockItem = generateMockItemData() as ItemData

        mock.add(
            {
                method: 'POST',
                path: `/${Elasticsearch.defaultIndex}/_search`,
            },
            () => {
                return {
                    hits: {
                        total: { value: 1 },
                        hits: [{ _source: mockItem }],
                    },
                }
            }
        )

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
            const shouldBeNotified = new WatcherNotificationService(client).userShouldBeNotified(
                date
            )

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
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                title: faker.random.word(),
                            },
                        },
                    ],
                },
            },
            metadata: { keyword: faker.random.word() },
            users: [new mongoose.Types.ObjectId(userId)],
            createdAt: creationDate,
        }

        const callback = jest.fn(() => console.log('Callback called!'))

        await new WatcherNotificationService(client).notifyUser(user, watcher, callback)

        expect(sendEmailMock).toBeCalledTimes(1)
        expect(callback).toBeCalledTimes(1)

        expect(user.watchers[0].notifiedAt).toBeTruthy()
    })
})
