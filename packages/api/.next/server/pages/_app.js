/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-query */ \"react-query\");\n/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_query__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/store */ \"./src/store/index.ts\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\nconst MyApp = ({ Component , pageProps  })=>{\n    const getLayout = Component.getLayout ?? ((page)=>page\n    );\n    const queryClient = new react_query__WEBPACK_IMPORTED_MODULE_2__.QueryClient();\n    (axios__WEBPACK_IMPORTED_MODULE_5___default().defaults.headers.post[\"Content-Type\"]) = \"application/json\";\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_1___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"viewport\",\n                        content: \"width=device-width, initial-scale=1\"\n                    }, void 0, false, {\n                        fileName: \"/home/william/Documents/mewi-monolith/packages/api/src/pages/_app.tsx\",\n                        lineNumber: 30,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"theme-color\",\n                        content: \"#000000\"\n                    }, void 0, false, {\n                        fileName: \"/home/william/Documents/mewi-monolith/packages/api/src/pages/_app.tsx\",\n                        lineNumber: 31,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"description\",\n                        content: \"Web site created using create-react-app\"\n                    }, void 0, false, {\n                        fileName: \"/home/william/Documents/mewi-monolith/packages/api/src/pages/_app.tsx\",\n                        lineNumber: 32,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        charSet: \"utf-8\"\n                    }, void 0, false, {\n                        fileName: \"/home/william/Documents/mewi-monolith/packages/api/src/pages/_app.tsx\",\n                        lineNumber: 33,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"google-signin-client_id\",\n                        content: \"988378722186-sad5450gog2mdrlef5jrd8ohii22om24.apps.googleusercontent.com\"\n                    }, void 0, false, {\n                        fileName: \"/home/william/Documents/mewi-monolith/packages/api/src/pages/_app.tsx\",\n                        lineNumber: 34,\n                        columnNumber: 17\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/william/Documents/mewi-monolith/packages/api/src/pages/_app.tsx\",\n                lineNumber: 29,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_query__WEBPACK_IMPORTED_MODULE_2__.QueryClientProvider, {\n                client: queryClient,\n                children: getLayout(/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/home/william/Documents/mewi-monolith/packages/api/src/pages/_app.tsx\",\n                    lineNumber: 40,\n                    columnNumber: 28\n                }, undefined))\n            }, void 0, false, {\n                fileName: \"/home/william/Documents/mewi-monolith/packages/api/src/pages/_app.tsx\",\n                lineNumber: 39,\n                columnNumber: 13\n            }, undefined)\n        ]\n    }, void 0, true);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_store__WEBPACK_IMPORTED_MODULE_4__.wrapper.withRedux(MyApp));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFFNEI7QUFFa0M7QUFDakM7QUFDSTtBQUNSO0FBYXpCLE1BQU1LLEtBQUssR0FBRyxDQUFDLEVBQUVDLFNBQVMsR0FBRUMsU0FBUyxHQUFzQixHQUFLO0lBQzVELE1BQU1DLFNBQVMsR0FBR0YsU0FBUyxDQUFDRSxTQUFTLElBQUksQ0FBQyxDQUFDQyxJQUFJLEdBQUtBLElBQUk7SUFBQSxDQUFDO0lBQ3pELE1BQU1DLFdBQVcsR0FBRyxJQUFJVCxvREFBVyxFQUFFO0lBRXJDRyxvRkFBMkMsR0FBRyxrQkFBa0I7SUFFaEUscUJBQ0k7OzBCQUNJLDhEQUFDSixrREFBSTs7a0NBQ0QsOERBQUNjLE1BQUk7d0JBQUNDLElBQUksRUFBQyxVQUFVO3dCQUFDQyxPQUFPLEVBQUMscUNBQXFDOzs7OztpQ0FBRztrQ0FDdEUsOERBQUNGLE1BQUk7d0JBQUNDLElBQUksRUFBQyxhQUFhO3dCQUFDQyxPQUFPLEVBQUMsU0FBUzs7Ozs7aUNBQUc7a0NBQzdDLDhEQUFDRixNQUFJO3dCQUFDQyxJQUFJLEVBQUMsYUFBYTt3QkFBQ0MsT0FBTyxFQUFDLHlDQUF5Qzs7Ozs7aUNBQUc7a0NBQzdFLDhEQUFDRixNQUFJO3dCQUFDRyxPQUFPLEVBQUMsT0FBTzs7Ozs7aUNBQUc7a0NBQ3hCLDhEQUFDSCxNQUFJO3dCQUNEQyxJQUFJLEVBQUMseUJBQXlCO3dCQUM5QkMsT0FBTyxFQUFDLDBFQUEwRTs7Ozs7aUNBQzlFOzs7Ozs7eUJBQ0w7MEJBQ1AsOERBQUNkLDREQUFtQjtnQkFBQ2dCLE1BQU0sRUFBRVIsV0FBVzswQkFDbkNGLFNBQVMsZUFBQyw4REFBQ0YsU0FBUztvQkFBRSxHQUFHQyxTQUFTOzs7Ozs2QkFBSSxDQUFDOzs7Ozt5QkFDdEI7O29CQUN2QixDQUNOO0NBQ0o7QUFFRCxpRUFBZUoscURBQWlCLENBQUNFLEtBQUssQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2FwaS8uL3NyYy9wYWdlcy9fYXBwLnRzeD9mOWQ2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRQYWdlIH0gZnJvbSAnbmV4dCdcbmltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCdcbmltcG9ydCBIZWFkIGZyb20gJ25leHQvaGVhZCdcbmltcG9ydCB7IFJlYWN0RWxlbWVudCwgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gJ3JlYWN0LXF1ZXJ5J1xuaW1wb3J0ICdAL3N0eWxlcy9nbG9iYWxzLmNzcydcbmltcG9ydCB7IHdyYXBwZXIgfSBmcm9tICdAL3N0b3JlJ1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJ1xuXG50eXBlIE5leHRQYWdlV2l0aExheW91dCA9IE5leHRQYWdlICYge1xuICAgIGdldExheW91dD86IChwYWdlOiBSZWFjdEVsZW1lbnQpID0+IFJlYWN0Tm9kZVxufVxuXG50eXBlIEFwcFByb3BzV2l0aExheW91dCA9IEFwcFByb3BzICYge1xuICAgIENvbXBvbmVudDogTmV4dFBhZ2VXaXRoTGF5b3V0XG4gICAgcGFnZVByb3BzOiBBcHBQcm9wc1sncGFnZVByb3BzJ10gJiB7XG4gICAgICAgIGluaXRpYWxSZWR1eFN0YXRlOiBhbnlcbiAgICB9XG59XG5cbmNvbnN0IE15QXBwID0gKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHNXaXRoTGF5b3V0KSA9PiB7XG4gICAgY29uc3QgZ2V0TGF5b3V0ID0gQ29tcG9uZW50LmdldExheW91dCA/PyAoKHBhZ2UpID0+IHBhZ2UpXG4gICAgY29uc3QgcXVlcnlDbGllbnQgPSBuZXcgUXVlcnlDbGllbnQoKVxuXG4gICAgYXhpb3MuZGVmYXVsdHMuaGVhZGVycy5wb3N0WydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uJ1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPD5cbiAgICAgICAgICAgIDxIZWFkPlxuICAgICAgICAgICAgICAgIDxtZXRhIG5hbWU9J3ZpZXdwb3J0JyBjb250ZW50PSd3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MScgLz5cbiAgICAgICAgICAgICAgICA8bWV0YSBuYW1lPSd0aGVtZS1jb2xvcicgY29udGVudD0nIzAwMDAwMCcgLz5cbiAgICAgICAgICAgICAgICA8bWV0YSBuYW1lPSdkZXNjcmlwdGlvbicgY29udGVudD0nV2ViIHNpdGUgY3JlYXRlZCB1c2luZyBjcmVhdGUtcmVhY3QtYXBwJyAvPlxuICAgICAgICAgICAgICAgIDxtZXRhIGNoYXJTZXQ9J3V0Zi04JyAvPlxuICAgICAgICAgICAgICAgIDxtZXRhXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9J2dvb2dsZS1zaWduaW4tY2xpZW50X2lkJ1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50PSc5ODgzNzg3MjIxODYtc2FkNTQ1MGdvZzJtZHJsZWY1anJkOG9oaWkyMm9tMjQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nXG4gICAgICAgICAgICAgICAgPjwvbWV0YT5cbiAgICAgICAgICAgIDwvSGVhZD5cbiAgICAgICAgICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAgICAgICAgICAgIHtnZXRMYXlvdXQoPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPil9XG4gICAgICAgICAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+XG4gICAgICAgIDwvPlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgd3JhcHBlci53aXRoUmVkdXgoTXlBcHApXG4iXSwibmFtZXMiOlsiSGVhZCIsIlF1ZXJ5Q2xpZW50IiwiUXVlcnlDbGllbnRQcm92aWRlciIsIndyYXBwZXIiLCJheGlvcyIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwiZ2V0TGF5b3V0IiwicGFnZSIsInF1ZXJ5Q2xpZW50IiwiZGVmYXVsdHMiLCJoZWFkZXJzIiwicG9zdCIsIm1ldGEiLCJuYW1lIiwiY29udGVudCIsImNoYXJTZXQiLCJjbGllbnQiLCJ3aXRoUmVkdXgiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/store/index.ts":
/*!****************************!*\
  !*** ./src/store/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"store\": () => (/* binding */ store),\n/* harmony export */   \"wrapper\": () => (/* binding */ wrapper)\n/* harmony export */ });\n/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ \"redux\");\n/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! redux-thunk */ \"redux-thunk\");\n/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(redux_thunk__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var redux_devtools_extension__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! redux-devtools-extension */ \"redux-devtools-extension\");\n/* harmony import */ var redux_devtools_extension__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(redux_devtools_extension__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var redux_observable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! redux-observable */ \"redux-observable\");\n/* harmony import */ var redux_observable__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(redux_observable__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_redux_wrapper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next-redux-wrapper */ \"next-redux-wrapper\");\n/* harmony import */ var next_redux_wrapper__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_redux_wrapper__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./reducer */ \"./src/store/reducer.ts\");\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @reduxjs/toolkit */ \"@reduxjs/toolkit\");\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_6__);\n\n\n\n\n\n\n\nconst epicMiddleware = (0,redux_observable__WEBPACK_IMPORTED_MODULE_3__.createEpicMiddleware)();\nconst composedEnhancer = (0,redux_devtools_extension__WEBPACK_IMPORTED_MODULE_2__.composeWithDevTools)((0,redux__WEBPACK_IMPORTED_MODULE_0__.applyMiddleware)((redux_thunk__WEBPACK_IMPORTED_MODULE_1___default()), epicMiddleware));\nconst store = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_6__.configureStore)({\n    reducer: _reducer__WEBPACK_IMPORTED_MODULE_5__.rootReducer,\n    middleware: (getDefaultMiddleware)=>getDefaultMiddleware()\n    ,\n    enhancers: [\n        composedEnhancer\n    ]\n});\nconst wrapper = (0,next_redux_wrapper__WEBPACK_IMPORTED_MODULE_4__.createWrapper)(()=>store\n);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc3RvcmUvaW5kZXgudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQThDO0FBQ0w7QUFDcUI7QUFDUDtBQUNMO0FBQ1g7QUFDVTtBQUVqRCxNQUFNTyxjQUFjLEdBQUdKLHNFQUFvQixFQUFFO0FBQzdDLE1BQU1LLGdCQUFnQixHQUFHTiw2RUFBbUIsQ0FBQ0Ysc0RBQWUsQ0FBQ0Msb0RBQWUsRUFBRU0sY0FBYyxDQUFDLENBQUM7QUFFdkYsTUFBTUUsS0FBSyxHQUFHSCxnRUFBYyxDQUFDO0lBQ2hDSSxPQUFPLEVBQUVMLGlEQUFXO0lBQ3BCTSxVQUFVLEVBQUUsQ0FBQ0Msb0JBQW9CLEdBQUtBLG9CQUFvQixFQUFFO0lBQUE7SUFDNURDLFNBQVMsRUFBRTtRQUFDTCxnQkFBZ0I7S0FBQztDQUNoQyxDQUFDO0FBS0ssTUFBTU0sT0FBTyxHQUFHVixpRUFBYSxDQUFtQixJQUFNSyxLQUFLO0FBQUEsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2FwaS8uL3NyYy9zdG9yZS9pbmRleC50cz9jZWU2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFwcGx5TWlkZGxld2FyZSwgU3RvcmUgfSBmcm9tICdyZWR1eCdcbmltcG9ydCB0aHVua01pZGRsZXdhcmUgZnJvbSAncmVkdXgtdGh1bmsnXG5pbXBvcnQgeyBjb21wb3NlV2l0aERldlRvb2xzIH0gZnJvbSAncmVkdXgtZGV2dG9vbHMtZXh0ZW5zaW9uJ1xuaW1wb3J0IHsgY3JlYXRlRXBpY01pZGRsZXdhcmUgfSBmcm9tICdyZWR1eC1vYnNlcnZhYmxlJ1xuaW1wb3J0IHsgY3JlYXRlV3JhcHBlciB9IGZyb20gJ25leHQtcmVkdXgtd3JhcHBlcidcbmltcG9ydCB7IHJvb3RSZWR1Y2VyIH0gZnJvbSAnLi9yZWR1Y2VyJ1xuaW1wb3J0IHsgY29uZmlndXJlU3RvcmUgfSBmcm9tICdAcmVkdXhqcy90b29sa2l0J1xuXG5jb25zdCBlcGljTWlkZGxld2FyZSA9IGNyZWF0ZUVwaWNNaWRkbGV3YXJlKClcbmNvbnN0IGNvbXBvc2VkRW5oYW5jZXIgPSBjb21wb3NlV2l0aERldlRvb2xzKGFwcGx5TWlkZGxld2FyZSh0aHVua01pZGRsZXdhcmUsIGVwaWNNaWRkbGV3YXJlKSlcblxuZXhwb3J0IGNvbnN0IHN0b3JlID0gY29uZmlndXJlU3RvcmUoe1xuICAgIHJlZHVjZXI6IHJvb3RSZWR1Y2VyLFxuICAgIG1pZGRsZXdhcmU6IChnZXREZWZhdWx0TWlkZGxld2FyZSkgPT4gZ2V0RGVmYXVsdE1pZGRsZXdhcmUoKSxcbiAgICBlbmhhbmNlcnM6IFtjb21wb3NlZEVuaGFuY2VyXSxcbn0pXG5cbmV4cG9ydCB0eXBlIFJvb3RTdGF0ZSA9IFJldHVyblR5cGU8dHlwZW9mIHN0b3JlLmdldFN0YXRlPlxuZXhwb3J0IHR5cGUgQXBwRGlzcGF0Y2ggPSB0eXBlb2Ygc3RvcmUuZGlzcGF0Y2hcblxuZXhwb3J0IGNvbnN0IHdyYXBwZXIgPSBjcmVhdGVXcmFwcGVyPFN0b3JlPFJvb3RTdGF0ZT4+KCgpID0+IHN0b3JlKVxuIl0sIm5hbWVzIjpbImFwcGx5TWlkZGxld2FyZSIsInRodW5rTWlkZGxld2FyZSIsImNvbXBvc2VXaXRoRGV2VG9vbHMiLCJjcmVhdGVFcGljTWlkZGxld2FyZSIsImNyZWF0ZVdyYXBwZXIiLCJyb290UmVkdWNlciIsImNvbmZpZ3VyZVN0b3JlIiwiZXBpY01pZGRsZXdhcmUiLCJjb21wb3NlZEVuaGFuY2VyIiwic3RvcmUiLCJyZWR1Y2VyIiwibWlkZGxld2FyZSIsImdldERlZmF1bHRNaWRkbGV3YXJlIiwiZW5oYW5jZXJzIiwid3JhcHBlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/store/index.ts\n");

/***/ }),

/***/ "./src/store/reducer.ts":
/*!******************************!*\
  !*** ./src/store/reducer.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"rootReducer\": () => (/* binding */ rootReducer)\n/* harmony export */ });\n/* harmony import */ var _user_slice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user/slice */ \"./src/store/user/slice.ts\");\n/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! redux */ \"redux\");\n/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(redux__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst rootReducer = (0,redux__WEBPACK_IMPORTED_MODULE_1__.combineReducers)({\n    auth: _user_slice__WEBPACK_IMPORTED_MODULE_0__[\"default\"]\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc3RvcmUvcmVkdWNlci50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQXNDO0FBQ0M7QUFFaEMsTUFBTUUsV0FBVyxHQUFHRCxzREFBZSxDQUFDO0lBQ3ZDRSxJQUFJLEVBQUVILG1EQUFXO0NBQ3BCLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hcGkvLi9zcmMvc3RvcmUvcmVkdWNlci50cz83MGRjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhdXRoUmVkdWNlciBmcm9tICcuL3VzZXIvc2xpY2UnXG5pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcblxuZXhwb3J0IGNvbnN0IHJvb3RSZWR1Y2VyID0gY29tYmluZVJlZHVjZXJzKHtcbiAgICBhdXRoOiBhdXRoUmVkdWNlcixcbn0pXG4iXSwibmFtZXMiOlsiYXV0aFJlZHVjZXIiLCJjb21iaW5lUmVkdWNlcnMiLCJyb290UmVkdWNlciIsImF1dGgiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/store/reducer.ts\n");

/***/ }),

/***/ "./src/store/user/creators.ts":
/*!************************************!*\
  !*** ./src/store/user/creators.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"setLoggedInStatus\": () => (/* binding */ setLoggedInStatus)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @reduxjs/toolkit */ \"@reduxjs/toolkit\");\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ \"./src/store/user/types.ts\");\n\n\nconst setLoggedInStatus = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createAction)(_types__WEBPACK_IMPORTED_MODULE_1__.UserActionTypes.SET_LOGGED_IN_STATUS, (status)=>{\n    return {\n        payload: status\n    };\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc3RvcmUvdXNlci9jcmVhdG9ycy50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQStDO0FBQ047QUFFbEMsTUFBTUUsaUJBQWlCLEdBQUdGLDhEQUFZLENBQ3pDQyx3RUFBb0MsRUFDcEMsQ0FBQ0csTUFBZSxHQUFLO0lBQ2pCLE9BQU87UUFDSEMsT0FBTyxFQUFFRCxNQUFNO0tBQ2xCO0NBQ0osQ0FDSiIsInNvdXJjZXMiOlsid2VicGFjazovL2FwaS8uL3NyYy9zdG9yZS91c2VyL2NyZWF0b3JzLnRzP2ViODQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQWN0aW9uIH0gZnJvbSAnQHJlZHV4anMvdG9vbGtpdCdcbmltcG9ydCB7IFVzZXJBY3Rpb25UeXBlcyB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBjb25zdCBzZXRMb2dnZWRJblN0YXR1cyA9IGNyZWF0ZUFjdGlvbihcbiAgICBVc2VyQWN0aW9uVHlwZXMuU0VUX0xPR0dFRF9JTl9TVEFUVVMsXG4gICAgKHN0YXR1czogYm9vbGVhbikgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGF5bG9hZDogc3RhdHVzLFxuICAgICAgICB9XG4gICAgfVxuKVxuIl0sIm5hbWVzIjpbImNyZWF0ZUFjdGlvbiIsIlVzZXJBY3Rpb25UeXBlcyIsInNldExvZ2dlZEluU3RhdHVzIiwiU0VUX0xPR0dFRF9JTl9TVEFUVVMiLCJzdGF0dXMiLCJwYXlsb2FkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/store/user/creators.ts\n");

/***/ }),

/***/ "./src/store/user/slice.ts":
/*!*********************************!*\
  !*** ./src/store/user/slice.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"userSlice\": () => (/* binding */ userSlice)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @reduxjs/toolkit */ \"@reduxjs/toolkit\");\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _creators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./creators */ \"./src/store/user/creators.ts\");\n\n\nconst initialState = {\n    isLoggedIn: false\n};\nconst userSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({\n    name: \"user\",\n    initialState,\n    reducers: {},\n    extraReducers: (builder)=>{\n        builder.addCase(_creators__WEBPACK_IMPORTED_MODULE_1__.setLoggedInStatus, (state, action)=>{\n            state.isLoggedIn = action.payload;\n        });\n    }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (userSlice.reducer);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc3RvcmUvdXNlci9zbGljZS50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUE4QztBQUNBO0FBRzlDLE1BQU1FLFlBQVksR0FBYztJQUM1QkMsVUFBVSxFQUFFLEtBQUs7Q0FDcEI7QUFFTSxNQUFNQyxTQUFTLEdBQUdKLDZEQUFXLENBQUM7SUFDakNLLElBQUksRUFBRSxNQUFNO0lBQ1pILFlBQVk7SUFDWkksUUFBUSxFQUFFLEVBQUU7SUFDWkMsYUFBYSxFQUFFLENBQUNDLE9BQU8sR0FBSztRQUN4QkEsT0FBTyxDQUFDQyxPQUFPLENBQUNSLHdEQUFpQixFQUFFLENBQUNTLEtBQUssRUFBRUMsTUFBTSxHQUFLO1lBQ2xERCxLQUFLLENBQUNQLFVBQVUsR0FBR1EsTUFBTSxDQUFDQyxPQUFPO1NBQ3BDLENBQUM7S0FDTDtDQUNKLENBQUM7QUFFRixpRUFBZVIsU0FBUyxDQUFDUyxPQUFPIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXBpLy4vc3JjL3N0b3JlL3VzZXIvc2xpY2UudHM/YWMyMyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVTbGljZSB9IGZyb20gJ0ByZWR1eGpzL3Rvb2xraXQnXG5pbXBvcnQgeyBzZXRMb2dnZWRJblN0YXR1cyB9IGZyb20gJy4vY3JlYXRvcnMnXG5pbXBvcnQgeyBVc2VyU3RhdGUgfSBmcm9tICcuL3R5cGVzJ1xuXG5jb25zdCBpbml0aWFsU3RhdGU6IFVzZXJTdGF0ZSA9IHtcbiAgICBpc0xvZ2dlZEluOiBmYWxzZSxcbn1cblxuZXhwb3J0IGNvbnN0IHVzZXJTbGljZSA9IGNyZWF0ZVNsaWNlKHtcbiAgICBuYW1lOiAndXNlcicsXG4gICAgaW5pdGlhbFN0YXRlLFxuICAgIHJlZHVjZXJzOiB7fSxcbiAgICBleHRyYVJlZHVjZXJzOiAoYnVpbGRlcikgPT4ge1xuICAgICAgICBidWlsZGVyLmFkZENhc2Uoc2V0TG9nZ2VkSW5TdGF0dXMsIChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBzdGF0ZS5pc0xvZ2dlZEluID0gYWN0aW9uLnBheWxvYWRcbiAgICAgICAgfSlcbiAgICB9LFxufSlcblxuZXhwb3J0IGRlZmF1bHQgdXNlclNsaWNlLnJlZHVjZXJcbiJdLCJuYW1lcyI6WyJjcmVhdGVTbGljZSIsInNldExvZ2dlZEluU3RhdHVzIiwiaW5pdGlhbFN0YXRlIiwiaXNMb2dnZWRJbiIsInVzZXJTbGljZSIsIm5hbWUiLCJyZWR1Y2VycyIsImV4dHJhUmVkdWNlcnMiLCJidWlsZGVyIiwiYWRkQ2FzZSIsInN0YXRlIiwiYWN0aW9uIiwicGF5bG9hZCIsInJlZHVjZXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/store/user/slice.ts\n");

/***/ }),

/***/ "./src/store/user/types.ts":
/*!*********************************!*\
  !*** ./src/store/user/types.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"UserActionTypes\": () => (/* binding */ UserActionTypes)\n/* harmony export */ });\nvar UserActionTypes;\n(function(UserActionTypes) {\n    UserActionTypes[\"SET_LOGGED_IN_STATUS\"] = \"user/set-logged-in-status\";\n})(UserActionTypes || (UserActionTypes = {}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc3RvcmUvdXNlci90eXBlcy50cy5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQU8sSUFJQSxlQUVOO1VBRldBLGVBQWU7SUFBZkEsZUFBZSxDQUN2QkMsc0JBQW9CLElBQUcsMkJBQTJCO0dBRDFDRCxlQUFlLEtBQWZBLGVBQWUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hcGkvLi9zcmMvc3RvcmUvdXNlci90eXBlcy50cz82NjcyIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgVXNlclN0YXRlIHtcbiAgICBpc0xvZ2dlZEluOiBib29sZWFuXG59XG5cbmV4cG9ydCBlbnVtIFVzZXJBY3Rpb25UeXBlcyB7XG4gICAgU0VUX0xPR0dFRF9JTl9TVEFUVVMgPSAndXNlci9zZXQtbG9nZ2VkLWluLXN0YXR1cycsXG59XG4iXSwibmFtZXMiOlsiVXNlckFjdGlvblR5cGVzIiwiU0VUX0xPR0dFRF9JTl9TVEFUVVMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/store/user/types.ts\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "@reduxjs/toolkit":
/*!***********************************!*\
  !*** external "@reduxjs/toolkit" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@reduxjs/toolkit");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("axios");

/***/ }),

/***/ "next-redux-wrapper":
/*!*************************************!*\
  !*** external "next-redux-wrapper" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next-redux-wrapper");

/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ "react-query":
/*!******************************!*\
  !*** external "react-query" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-query");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "redux":
/*!************************!*\
  !*** external "redux" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("redux");

/***/ }),

/***/ "redux-devtools-extension":
/*!*******************************************!*\
  !*** external "redux-devtools-extension" ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("redux-devtools-extension");

/***/ }),

/***/ "redux-observable":
/*!***********************************!*\
  !*** external "redux-observable" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("redux-observable");

/***/ }),

/***/ "redux-thunk":
/*!******************************!*\
  !*** external "redux-thunk" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("redux-thunk");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();