"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const error_1 = __importDefault(require("../src/widgets/error"));
const routes_1 = __importDefault(require("./routes"));
// Setup express
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// Use routing on the /api prefix
app.use('/api', routes_1.default);
// Send error widget for incorrect request URL
app.use('*', (req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send((0, error_1.default)('Unknown', '-28%', 'Invalid API URL!', '-19%'));
});
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : (process.env.NODE_ENV === 'production' ? undefined : 3000);
// Start listening on defined port
app.listen(PORT, () => {
    console.log(`GitWidgets listening at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map