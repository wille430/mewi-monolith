"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.createEmailRecordFactory = exports.createScrapingLogFactory = exports.createListingFactory = exports.createUserFactory = exports.createUserWatcherFactory = exports.createWatcherFactory = void 0;
var prisma_factory_1 = require("prisma-factory");
function createWatcherFactory(requiredAttrs, options, hooks) {
    return (0, prisma_factory_1.createFactory)('Watcher', requiredAttrs, __assign(__assign({}, options), { client: '/home/william/Documents/mewi-monolith/packages/prisma/dist/client' }), hooks);
}
exports.createWatcherFactory = createWatcherFactory;
function createUserWatcherFactory(requiredAttrs, options, hooks) {
    return (0, prisma_factory_1.createFactory)('UserWatcher', requiredAttrs, __assign(__assign({}, options), { client: '/home/william/Documents/mewi-monolith/packages/prisma/dist/client' }), hooks);
}
exports.createUserWatcherFactory = createUserWatcherFactory;
function createUserFactory(requiredAttrs, options, hooks) {
    return (0, prisma_factory_1.createFactory)('User', requiredAttrs, __assign(__assign({}, options), { client: '/home/william/Documents/mewi-monolith/packages/prisma/dist/client' }), hooks);
}
exports.createUserFactory = createUserFactory;
function createListingFactory(requiredAttrs, options, hooks) {
    return (0, prisma_factory_1.createFactory)('Listing', requiredAttrs, __assign(__assign({}, options), { client: '/home/william/Documents/mewi-monolith/packages/prisma/dist/client' }), hooks);
}
exports.createListingFactory = createListingFactory;
function createScrapingLogFactory(requiredAttrs, options, hooks) {
    return (0, prisma_factory_1.createFactory)('ScrapingLog', requiredAttrs, __assign(__assign({}, options), { client: '/home/william/Documents/mewi-monolith/packages/prisma/dist/client' }), hooks);
}
exports.createScrapingLogFactory = createScrapingLogFactory;
function createEmailRecordFactory(requiredAttrs, options, hooks) {
    return (0, prisma_factory_1.createFactory)('EmailRecord', requiredAttrs, __assign(__assign({}, options), { client: '/home/william/Documents/mewi-monolith/packages/prisma/dist/client' }), hooks);
}
exports.createEmailRecordFactory = createEmailRecordFactory;
