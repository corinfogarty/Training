"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./components/ResourceLightbox.tsx":
/*!*****************************************!*\
  !*** ./components/ResourceLightbox.tsx ***!
  \*****************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ ResourceLightbox; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _barrel_optimize_names_Modal_react_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! __barrel_optimize__?names=Modal!=!react-bootstrap */ \"(app-pages-browser)/./node_modules/react-bootstrap/esm/Modal.js\");\n/* harmony import */ var _barrel_optimize_names_ExternalLink_Link_lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! __barrel_optimize__?names=ExternalLink,Link!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/link.js\");\n/* harmony import */ var _barrel_optimize_names_ExternalLink_Link_lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! __barrel_optimize__?names=ExternalLink,Link!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/external-link.js\");\n/* harmony import */ var _utils_defaultImages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/utils/defaultImages */ \"(app-pages-browser)/./utils/defaultImages.ts\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \n\n\n\nfunction ResourceLightbox(param) {\n    let { resource, show, onHide } = param;\n    const getFormattedContent = ()=>{\n        try {\n            return JSON.parse(resource.description);\n        } catch (e) {\n            return {\n                title: resource.title,\n                description: resource.description,\n                credentials: {}\n            };\n        }\n    };\n    const content = getFormattedContent();\n    const previewImage = resource.previewImage || (0,_utils_defaultImages__WEBPACK_IMPORTED_MODULE_1__.getDefaultPreviewImage)(resource.category);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Modal_react_bootstrap__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n        show: show,\n        onHide: onHide,\n        size: \"lg\",\n        centered: true,\n        className: \"resource-modal\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Modal_react_bootstrap__WEBPACK_IMPORTED_MODULE_2__[\"default\"].Header, {\n                closeButton: true,\n                className: \"border-0 pb-0\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Modal_react_bootstrap__WEBPACK_IMPORTED_MODULE_2__[\"default\"].Title, {\n                    className: \"fs-4\",\n                    children: resource.title\n                }, void 0, false, {\n                    fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                    lineNumber: 54,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                lineNumber: 53,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Modal_react_bootstrap__WEBPACK_IMPORTED_MODULE_2__[\"default\"].Body, {\n                className: \"pt-2\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"text-center mb-4\",\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                            src: previewImage,\n                            alt: resource.title,\n                            className: \"img-fluid rounded shadow-sm\",\n                            style: {\n                                maxHeight: \"400px\",\n                                objectFit: \"contain\"\n                            }\n                        }, void 0, false, {\n                            fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                            lineNumber: 58,\n                            columnNumber: 11\n                        }, this)\n                    }, void 0, false, {\n                        fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                        lineNumber: 57,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"mb-4\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h6\", {\n                                className: \"text-muted mb-3\",\n                                children: \"Description\"\n                            }, void 0, false, {\n                                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                lineNumber: 67,\n                                columnNumber: 11\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"formatted-content\",\n                                dangerouslySetInnerHTML: {\n                                    __html: content.description\n                                }\n                            }, void 0, false, {\n                                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                lineNumber: 68,\n                                columnNumber: 11\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                        lineNumber: 66,\n                        columnNumber: 9\n                    }, this),\n                    content.courseContent && content.courseContent.length > 0 && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"mb-4\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h6\", {\n                                className: \"text-muted mb-3\",\n                                children: \"Course Content\"\n                            }, void 0, false, {\n                                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                lineNumber: 76,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"bg-light rounded p-3\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                                    className: \"list-unstyled mb-0\",\n                                    children: content.courseContent.map((item, index)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                            className: \"mb-2 d-flex\",\n                                            children: [\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                    className: \"text-primary me-2\",\n                                                    children: \"•\"\n                                                }, void 0, false, {\n                                                    fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                                    lineNumber: 81,\n                                                    columnNumber: 21\n                                                }, this),\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                    children: item\n                                                }, void 0, false, {\n                                                    fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                                    lineNumber: 82,\n                                                    columnNumber: 21\n                                                }, this)\n                                            ]\n                                        }, index, true, {\n                                            fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                            lineNumber: 80,\n                                            columnNumber: 19\n                                        }, this))\n                                }, void 0, false, {\n                                    fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                    lineNumber: 78,\n                                    columnNumber: 15\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                lineNumber: 77,\n                                columnNumber: 13\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                        lineNumber: 75,\n                        columnNumber: 11\n                    }, this),\n                    content.credentials && (content.credentials.username || content.credentials.password) && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"mb-4\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h6\", {\n                                className: \"text-muted mb-3\",\n                                children: \"Credentials\"\n                            }, void 0, false, {\n                                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                lineNumber: 92,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"bg-light rounded p-3\",\n                                children: [\n                                    content.credentials.username && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"mb-2\",\n                                        children: [\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"strong\", {\n                                                className: \"me-2\",\n                                                children: \"Username:\"\n                                            }, void 0, false, {\n                                                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                                lineNumber: 96,\n                                                columnNumber: 19\n                                            }, this),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"code\", {\n                                                children: content.credentials.username\n                                            }, void 0, false, {\n                                                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                                lineNumber: 97,\n                                                columnNumber: 19\n                                            }, this)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                        lineNumber: 95,\n                                        columnNumber: 17\n                                    }, this),\n                                    content.credentials.password && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        children: [\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"strong\", {\n                                                className: \"me-2\",\n                                                children: \"Password:\"\n                                            }, void 0, false, {\n                                                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                                lineNumber: 102,\n                                                columnNumber: 19\n                                            }, this),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"code\", {\n                                                children: content.credentials.password\n                                            }, void 0, false, {\n                                                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                                lineNumber: 103,\n                                                columnNumber: 19\n                                            }, this)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                        lineNumber: 101,\n                                        columnNumber: 17\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                lineNumber: 93,\n                                columnNumber: 13\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                        lineNumber: 91,\n                        columnNumber: 11\n                    }, this),\n                    resource.additionalUrls && resource.additionalUrls.length > 0 && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"mb-4\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h6\", {\n                                className: \"text-muted mb-3\",\n                                children: \"Additional Resources\"\n                            }, void 0, false, {\n                                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                lineNumber: 112,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"bg-light rounded p-3\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                                    className: \"list-unstyled mb-0\",\n                                    children: resource.additionalUrls.map((url, index)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                            className: \"mb-2\",\n                                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"a\", {\n                                                href: url,\n                                                target: \"_blank\",\n                                                rel: \"noopener noreferrer\",\n                                                className: \"d-flex align-items-center text-decoration-none\",\n                                                onClick: (e)=>e.stopPropagation(),\n                                                children: [\n                                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ExternalLink_Link_lucide_react__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n                                                        size: 14,\n                                                        className: \"me-2 text-primary\"\n                                                    }, void 0, false, {\n                                                        fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                                        lineNumber: 124,\n                                                        columnNumber: 23\n                                                    }, this),\n                                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                        className: \"text-break\",\n                                                        children: url\n                                                    }, void 0, false, {\n                                                        fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                                        lineNumber: 125,\n                                                        columnNumber: 23\n                                                    }, this),\n                                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ExternalLink_Link_lucide_react__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                                                        size: 14,\n                                                        className: \"ms-2 text-muted\"\n                                                    }, void 0, false, {\n                                                        fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                                        lineNumber: 126,\n                                                        columnNumber: 23\n                                                    }, this)\n                                                ]\n                                            }, void 0, true, {\n                                                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                                lineNumber: 117,\n                                                columnNumber: 21\n                                            }, this)\n                                        }, index, false, {\n                                            fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                            lineNumber: 116,\n                                            columnNumber: 19\n                                        }, this))\n                                }, void 0, false, {\n                                    fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                    lineNumber: 114,\n                                    columnNumber: 15\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                                lineNumber: 113,\n                                columnNumber: 13\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                        lineNumber: 111,\n                        columnNumber: 11\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n                lineNumber: 56,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/corinfogarty/Desktop/Dev Playground/Training/components/ResourceLightbox.tsx\",\n        lineNumber: 46,\n        columnNumber: 5\n    }, this);\n}\n_c = ResourceLightbox;\nvar _c;\n$RefreshReg$(_c, \"ResourceLightbox\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvUmVzb3VyY2VMaWdodGJveC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUdzRDtBQUN3QjtBQUNoQjtBQXNCL0MsU0FBU0ssaUJBQWlCLEtBQWlEO1FBQWpELEVBQUVDLFFBQVEsRUFBRUMsSUFBSSxFQUFFQyxNQUFNLEVBQXlCLEdBQWpEO0lBQ3ZDLE1BQU1DLHNCQUFzQjtRQUMxQixJQUFJO1lBQ0YsT0FBT0MsS0FBS0MsS0FBSyxDQUFDTCxTQUFTTSxXQUFXO1FBQ3hDLEVBQUUsVUFBTTtZQUNOLE9BQU87Z0JBQ0xDLE9BQU9QLFNBQVNPLEtBQUs7Z0JBQ3JCRCxhQUFhTixTQUFTTSxXQUFXO2dCQUNqQ0UsYUFBYSxDQUFDO1lBQ2hCO1FBQ0Y7SUFDRjtJQUVBLE1BQU1DLFVBQVVOO0lBRWhCLE1BQU1PLGVBQWVWLFNBQVNVLFlBQVksSUFBSVosNEVBQXNCQSxDQUFDRSxTQUFTVyxRQUFRO0lBRXRGLHFCQUNFLDhEQUFDakIsb0ZBQUtBO1FBQ0pPLE1BQU1BO1FBQ05DLFFBQVFBO1FBQ1JVLE1BQUs7UUFDTEMsUUFBUTtRQUNSQyxXQUFVOzswQkFFViw4REFBQ3BCLG9GQUFLQSxDQUFDcUIsTUFBTTtnQkFBQ0MsV0FBVztnQkFBQ0YsV0FBVTswQkFDbEMsNEVBQUNwQixvRkFBS0EsQ0FBQ3VCLEtBQUs7b0JBQUNILFdBQVU7OEJBQVFkLFNBQVNPLEtBQUs7Ozs7Ozs7Ozs7OzBCQUUvQyw4REFBQ2Isb0ZBQUtBLENBQUN3QixJQUFJO2dCQUFDSixXQUFVOztrQ0FDcEIsOERBQUNLO3dCQUFJTCxXQUFVO2tDQUNiLDRFQUFDTTs0QkFDQ0MsS0FBS1g7NEJBQ0xZLEtBQUt0QixTQUFTTyxLQUFLOzRCQUNuQk8sV0FBVTs0QkFDVlMsT0FBTztnQ0FBRUMsV0FBVztnQ0FBU0MsV0FBVzs0QkFBVTs7Ozs7Ozs7Ozs7a0NBSXRELDhEQUFDTjt3QkFBSUwsV0FBVTs7MENBQ2IsOERBQUNZO2dDQUFHWixXQUFVOzBDQUFrQjs7Ozs7OzBDQUNoQyw4REFBQ0s7Z0NBQ0NMLFdBQVU7Z0NBQ1ZhLHlCQUF5QjtvQ0FBRUMsUUFBUW5CLFFBQVFILFdBQVc7Z0NBQUM7Ozs7Ozs7Ozs7OztvQkFJMURHLFFBQVFvQixhQUFhLElBQUlwQixRQUFRb0IsYUFBYSxDQUFDQyxNQUFNLEdBQUcsbUJBQ3ZELDhEQUFDWDt3QkFBSUwsV0FBVTs7MENBQ2IsOERBQUNZO2dDQUFHWixXQUFVOzBDQUFrQjs7Ozs7OzBDQUNoQyw4REFBQ0s7Z0NBQUlMLFdBQVU7MENBQ2IsNEVBQUNpQjtvQ0FBR2pCLFdBQVU7OENBQ1hMLFFBQVFvQixhQUFhLENBQUNHLEdBQUcsQ0FBQyxDQUFDQyxNQUFNQyxzQkFDaEMsOERBQUNDOzRDQUFlckIsV0FBVTs7OERBQ3hCLDhEQUFDc0I7b0RBQUt0QixXQUFVOzhEQUFvQjs7Ozs7OzhEQUNwQyw4REFBQ3NCOzhEQUFNSDs7Ozs7OzsyQ0FGQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFVbEJ6QixRQUFRRCxXQUFXLElBQUtDLENBQUFBLFFBQVFELFdBQVcsQ0FBQzZCLFFBQVEsSUFBSTVCLFFBQVFELFdBQVcsQ0FBQzhCLFFBQVEsbUJBQ25GLDhEQUFDbkI7d0JBQUlMLFdBQVU7OzBDQUNiLDhEQUFDWTtnQ0FBR1osV0FBVTswQ0FBa0I7Ozs7OzswQ0FDaEMsOERBQUNLO2dDQUFJTCxXQUFVOztvQ0FDWkwsUUFBUUQsV0FBVyxDQUFDNkIsUUFBUSxrQkFDM0IsOERBQUNsQjt3Q0FBSUwsV0FBVTs7MERBQ2IsOERBQUN5QjtnREFBT3pCLFdBQVU7MERBQU87Ozs7OzswREFDekIsOERBQUMwQjswREFBTS9CLFFBQVFELFdBQVcsQ0FBQzZCLFFBQVE7Ozs7Ozs7Ozs7OztvQ0FHdEM1QixRQUFRRCxXQUFXLENBQUM4QixRQUFRLGtCQUMzQiw4REFBQ25COzswREFDQyw4REFBQ29CO2dEQUFPekIsV0FBVTswREFBTzs7Ozs7OzBEQUN6Qiw4REFBQzBCOzBEQUFNL0IsUUFBUUQsV0FBVyxDQUFDOEIsUUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQU81Q3RDLFNBQVN5QyxjQUFjLElBQUl6QyxTQUFTeUMsY0FBYyxDQUFDWCxNQUFNLEdBQUcsbUJBQzNELDhEQUFDWDt3QkFBSUwsV0FBVTs7MENBQ2IsOERBQUNZO2dDQUFHWixXQUFVOzBDQUFrQjs7Ozs7OzBDQUNoQyw4REFBQ0s7Z0NBQUlMLFdBQVU7MENBQ2IsNEVBQUNpQjtvQ0FBR2pCLFdBQVU7OENBQ1hkLFNBQVN5QyxjQUFjLENBQUNULEdBQUcsQ0FBQyxDQUFDVSxLQUFLUixzQkFDakMsOERBQUNDOzRDQUFlckIsV0FBVTtzREFDeEIsNEVBQUM2QjtnREFDQ0MsTUFBTUY7Z0RBQ05HLFFBQU87Z0RBQ1BDLEtBQUk7Z0RBQ0poQyxXQUFVO2dEQUNWaUMsU0FBUyxDQUFDQyxJQUFNQSxFQUFFQyxlQUFlOztrRUFFakMsOERBQUNwRCw2RkFBUUE7d0RBQUNlLE1BQU07d0RBQUlFLFdBQVU7Ozs7OztrRUFDOUIsOERBQUNzQjt3REFBS3RCLFdBQVU7a0VBQWM0Qjs7Ozs7O2tFQUM5Qiw4REFBQy9DLDZGQUFZQTt3REFBQ2lCLE1BQU07d0RBQUlFLFdBQVU7Ozs7Ozs7Ozs7OzsyQ0FWN0JvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUIzQjtLQS9Hd0JuQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9jb21wb25lbnRzL1Jlc291cmNlTGlnaHRib3gudHN4PzFjYTkiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB7IFJlc291cmNlLCBDYXRlZ29yeSB9IGZyb20gJ0BwcmlzbWEvY2xpZW50J1xuaW1wb3J0IHsgTW9kYWwsIEJ1dHRvbiwgQmFkZ2UgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXG5pbXBvcnQgeyBFeHRlcm5hbExpbmssIENhbGVuZGFyLCBDbG9jaywgTGluayBhcyBMaW5rSWNvbiB9IGZyb20gJ2x1Y2lkZS1yZWFjdCdcbmltcG9ydCB7IGdldERlZmF1bHRQcmV2aWV3SW1hZ2UgfSBmcm9tICdAL3V0aWxzL2RlZmF1bHRJbWFnZXMnXG5cbmludGVyZmFjZSBSZXNvdXJjZUxpZ2h0Ym94UHJvcHMge1xuICByZXNvdXJjZTogUmVzb3VyY2UgJiB7XG4gICAgY2F0ZWdvcnk/OiBDYXRlZ29yeSB8IG51bGxcbiAgfVxuICBzaG93OiBib29sZWFuXG4gIG9uSGlkZTogKCkgPT4gdm9pZFxufVxuXG5pbnRlcmZhY2UgRm9ybWF0dGVkQ29udGVudCB7XG4gIHRpdGxlOiBzdHJpbmdcbiAgZGVzY3JpcHRpb246IHN0cmluZ1xuICBjcmVkZW50aWFsczoge1xuICAgIHVzZXJuYW1lPzogc3RyaW5nXG4gICAgcGFzc3dvcmQ/OiBzdHJpbmdcbiAgfVxuICBjb3Vyc2VDb250ZW50Pzogc3RyaW5nW11cbiAgcHJldmlld0ltYWdlPzogc3RyaW5nXG4gIHVybD86IHN0cmluZ1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSZXNvdXJjZUxpZ2h0Ym94KHsgcmVzb3VyY2UsIHNob3csIG9uSGlkZSB9OiBSZXNvdXJjZUxpZ2h0Ym94UHJvcHMpIHtcbiAgY29uc3QgZ2V0Rm9ybWF0dGVkQ29udGVudCA9ICgpOiBGb3JtYXR0ZWRDb250ZW50ID0+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmVzb3VyY2UuZGVzY3JpcHRpb24pXG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZTogcmVzb3VyY2UudGl0bGUsXG4gICAgICAgIGRlc2NyaXB0aW9uOiByZXNvdXJjZS5kZXNjcmlwdGlvbixcbiAgICAgICAgY3JlZGVudGlhbHM6IHt9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgY29udGVudCA9IGdldEZvcm1hdHRlZENvbnRlbnQoKVxuXG4gIGNvbnN0IHByZXZpZXdJbWFnZSA9IHJlc291cmNlLnByZXZpZXdJbWFnZSB8fCBnZXREZWZhdWx0UHJldmlld0ltYWdlKHJlc291cmNlLmNhdGVnb3J5KVxuXG4gIHJldHVybiAoXG4gICAgPE1vZGFsIFxuICAgICAgc2hvdz17c2hvd30gXG4gICAgICBvbkhpZGU9e29uSGlkZX1cbiAgICAgIHNpemU9XCJsZ1wiXG4gICAgICBjZW50ZXJlZFxuICAgICAgY2xhc3NOYW1lPVwicmVzb3VyY2UtbW9kYWxcIlxuICAgID5cbiAgICAgIDxNb2RhbC5IZWFkZXIgY2xvc2VCdXR0b24gY2xhc3NOYW1lPVwiYm9yZGVyLTAgcGItMFwiPlxuICAgICAgICA8TW9kYWwuVGl0bGUgY2xhc3NOYW1lPVwiZnMtNFwiPntyZXNvdXJjZS50aXRsZX08L01vZGFsLlRpdGxlPlxuICAgICAgPC9Nb2RhbC5IZWFkZXI+XG4gICAgICA8TW9kYWwuQm9keSBjbGFzc05hbWU9XCJwdC0yXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgbWItNFwiPlxuICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgIHNyYz17cHJldmlld0ltYWdlfVxuICAgICAgICAgICAgYWx0PXtyZXNvdXJjZS50aXRsZX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImltZy1mbHVpZCByb3VuZGVkIHNoYWRvdy1zbVwiXG4gICAgICAgICAgICBzdHlsZT17eyBtYXhIZWlnaHQ6ICc0MDBweCcsIG9iamVjdEZpdDogJ2NvbnRhaW4nIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi00XCI+XG4gICAgICAgICAgPGg2IGNsYXNzTmFtZT1cInRleHQtbXV0ZWQgbWItM1wiPkRlc2NyaXB0aW9uPC9oNj5cbiAgICAgICAgICA8ZGl2IFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybWF0dGVkLWNvbnRlbnRcIlxuICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBjb250ZW50LmRlc2NyaXB0aW9uIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAge2NvbnRlbnQuY291cnNlQ29udGVudCAmJiBjb250ZW50LmNvdXJzZUNvbnRlbnQubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi00XCI+XG4gICAgICAgICAgICA8aDYgY2xhc3NOYW1lPVwidGV4dC1tdXRlZCBtYi0zXCI+Q291cnNlIENvbnRlbnQ8L2g2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1saWdodCByb3VuZGVkIHAtM1wiPlxuICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibGlzdC11bnN0eWxlZCBtYi0wXCI+XG4gICAgICAgICAgICAgICAge2NvbnRlbnQuY291cnNlQ29udGVudC5tYXAoKGl0ZW0sIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgICA8bGkga2V5PXtpbmRleH0gY2xhc3NOYW1lPVwibWItMiBkLWZsZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5IG1lLTJcIj7igKI8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPntpdGVtfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICB7Y29udGVudC5jcmVkZW50aWFscyAmJiAoY29udGVudC5jcmVkZW50aWFscy51c2VybmFtZSB8fCBjb250ZW50LmNyZWRlbnRpYWxzLnBhc3N3b3JkKSAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi00XCI+XG4gICAgICAgICAgICA8aDYgY2xhc3NOYW1lPVwidGV4dC1tdXRlZCBtYi0zXCI+Q3JlZGVudGlhbHM8L2g2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1saWdodCByb3VuZGVkIHAtM1wiPlxuICAgICAgICAgICAgICB7Y29udGVudC5jcmVkZW50aWFscy51c2VybmFtZSAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yXCI+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nIGNsYXNzTmFtZT1cIm1lLTJcIj5Vc2VybmFtZTo8L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgIDxjb2RlPntjb250ZW50LmNyZWRlbnRpYWxzLnVzZXJuYW1lfTwvY29kZT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAge2NvbnRlbnQuY3JlZGVudGlhbHMucGFzc3dvcmQgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nIGNsYXNzTmFtZT1cIm1lLTJcIj5QYXNzd29yZDo8L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgIDxjb2RlPntjb250ZW50LmNyZWRlbnRpYWxzLnBhc3N3b3JkfTwvY29kZT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHtyZXNvdXJjZS5hZGRpdGlvbmFsVXJscyAmJiByZXNvdXJjZS5hZGRpdGlvbmFsVXJscy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTRcIj5cbiAgICAgICAgICAgIDxoNiBjbGFzc05hbWU9XCJ0ZXh0LW11dGVkIG1iLTNcIj5BZGRpdGlvbmFsIFJlc291cmNlczwvaDY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLWxpZ2h0IHJvdW5kZWQgcC0zXCI+XG4gICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJsaXN0LXVuc3R5bGVkIG1iLTBcIj5cbiAgICAgICAgICAgICAgICB7cmVzb3VyY2UuYWRkaXRpb25hbFVybHMubWFwKCh1cmwsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgICA8bGkga2V5PXtpbmRleH0gY2xhc3NOYW1lPVwibWItMlwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBcbiAgICAgICAgICAgICAgICAgICAgICBocmVmPXt1cmx9IFxuICAgICAgICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiIFxuICAgICAgICAgICAgICAgICAgICAgIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgdGV4dC1kZWNvcmF0aW9uLW5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPExpbmtJY29uIHNpemU9ezE0fSBjbGFzc05hbWU9XCJtZS0yIHRleHQtcHJpbWFyeVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1icmVha1wiPnt1cmx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDxFeHRlcm5hbExpbmsgc2l6ZT17MTR9IGNsYXNzTmFtZT1cIm1zLTIgdGV4dC1tdXRlZFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICB7LyogLi4uIHJlc3Qgb2YgdGhlIG1vZGFsIGNvbnRlbnQgLi4uICovfVxuICAgICAgPC9Nb2RhbC5Cb2R5PlxuICAgIDwvTW9kYWw+XG4gIClcbn0gIl0sIm5hbWVzIjpbIk1vZGFsIiwiRXh0ZXJuYWxMaW5rIiwiTGluayIsIkxpbmtJY29uIiwiZ2V0RGVmYXVsdFByZXZpZXdJbWFnZSIsIlJlc291cmNlTGlnaHRib3giLCJyZXNvdXJjZSIsInNob3ciLCJvbkhpZGUiLCJnZXRGb3JtYXR0ZWRDb250ZW50IiwiSlNPTiIsInBhcnNlIiwiZGVzY3JpcHRpb24iLCJ0aXRsZSIsImNyZWRlbnRpYWxzIiwiY29udGVudCIsInByZXZpZXdJbWFnZSIsImNhdGVnb3J5Iiwic2l6ZSIsImNlbnRlcmVkIiwiY2xhc3NOYW1lIiwiSGVhZGVyIiwiY2xvc2VCdXR0b24iLCJUaXRsZSIsIkJvZHkiLCJkaXYiLCJpbWciLCJzcmMiLCJhbHQiLCJzdHlsZSIsIm1heEhlaWdodCIsIm9iamVjdEZpdCIsImg2IiwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwiLCJfX2h0bWwiLCJjb3Vyc2VDb250ZW50IiwibGVuZ3RoIiwidWwiLCJtYXAiLCJpdGVtIiwiaW5kZXgiLCJsaSIsInNwYW4iLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwic3Ryb25nIiwiY29kZSIsImFkZGl0aW9uYWxVcmxzIiwidXJsIiwiYSIsImhyZWYiLCJ0YXJnZXQiLCJyZWwiLCJvbkNsaWNrIiwiZSIsInN0b3BQcm9wYWdhdGlvbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/ResourceLightbox.tsx\n"));

/***/ })

});