"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMockUserData = exports.generateMockItemData = exports.randomEmail = void 0;
const tslib_1 = require("tslib");
const faker_1 = tslib_1.__importDefault(require("@faker-js/faker"));
const types_1 = require("../../../types/src/index.ts");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const randomEmail = () => {
    return `${faker_1.default.name.firstName()}@${faker_1.default.name.lastName()}@${faker_1.default.internet.domainName()}`;
};
exports.randomEmail = randomEmail;
/**
 * Generate fake item data
 * @param count How many items should be generated?
 * @param data Data that should overwrite generated data
 * @returns Array of items
 */
const generateMockItemData = (count = 1, data) => {
    const items = [];
    while (items.length < count) {
        items.push(Object.assign({ id: faker_1.default.datatype.uuid(), title: faker_1.default.random.words(5), category: [lodash_1.default.sample(Object.keys(types_1.categories)) || 'fordon'], imageUrl: [faker_1.default.internet.url()], isAuction: faker_1.default.datatype.boolean(), redirectUrl: faker_1.default.internet.url(), region: faker_1.default.address.cityName(), origin: Object.values(types_1.ListingOrigins)[Math.floor(Math.random() * Object.values(types_1.ListingOrigins).length)], price: {
                value: faker_1.default.datatype.number({ min: 10, max: 9999999 }),
                currency: 'kr',
            }, body: faker_1.default.lorem.paragraphs() }, data));
    }
    if (items.length > 1) {
        return items;
    }
    else {
        return items[0];
    }
};
exports.generateMockItemData = generateMockItemData;
const generateMockUserData = () => ({
    _id: faker_1.default.datatype.uuid(),
    email: (0, exports.randomEmail)(),
    password: faker_1.default.datatype.uuid(),
    premium: faker_1.default.datatype.boolean(),
    watchers: [],
    passwordResetSecret: faker_1.default.random.alpha({ count: 256 }),
});
exports.generateMockUserData = generateMockUserData;
//# sourceMappingURL=testUtils.js.map