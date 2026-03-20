"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTheme = exports.resolveTheme = exports.findData = exports.requestInBase64 = exports.getBoolean = exports.isValidHexColor = void 0;
const axios_1 = __importDefault(require("axios"));
const themes_1 = __importDefault(require("./data/themes"));
function isValidHexColor(hexColor) {
    return /^([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{4})$/.test(hexColor);
}
exports.isValidHexColor = isValidHexColor;
function getBoolean(str) {
    return str.toLowerCase() === 'true';
}
exports.getBoolean = getBoolean;
async function requestInBase64(url) {
    const response = await axios_1.default.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary').toString('base64');
}
exports.requestInBase64 = requestInBase64;
function findData(data, name) {
    return data.find(d => d.name.map(n => n.toUpperCase()).includes(name.toUpperCase()));
}
exports.findData = findData;
function resolveTheme(themeName) {
    var _a;
    return (_a = (themeName ? getTheme(themes_1.default, themeName) : undefined)) !== null && _a !== void 0 ? _a : getTheme(themes_1.default, 'default');
}
exports.resolveTheme = resolveTheme;
function getTheme(themeList, themeName) {
    return themeList.find(t => t.name.map(n => n.toUpperCase()).includes(themeName.toUpperCase()));
}
exports.getTheme = getTheme;
//# sourceMappingURL=utils.js.map