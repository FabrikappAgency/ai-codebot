"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.chatLLMCompletion = exports.llmCompletion = exports.clearMessages = exports.chatCompletion = void 0;
var openai_1 = require("openai");
var fs_1 = require("fs");
var dotenv_1 = require("dotenv");
var webbrowser_1 = require("langchain/tools/webbrowser");
var openai_2 = require("langchain/chat_models/openai");
var openai_3 = require("langchain/embeddings/openai");
dotenv_1["default"].config();
var openai_4 = require("@tectalic/openai");
var openaiClient = openai_4["default"]["default"](process.env.OPENAI_API_KEY);
openai_1["default"].apiKey = process.env.OPENAI_API_KEY;
var agents_1 = require("langchain/agents");
var tools_1 = require("langchain/tools");
function clearMessages(dataFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, fs_1["default"].writeFileSync(dataFilePath, JSON.stringify({ messages: [] }))];
        });
    });
}
exports.clearMessages = clearMessages;
function addMessage(newMessage) {
    return __awaiter(this, void 0, void 0, function () {
        var dataFilePath, data;
        return __generator(this, function (_a) {
            dataFilePath = "./data/data.json";
            data = JSON.parse(fs_1["default"].readFileSync(dataFilePath, "utf8"));
            data.messages.push(newMessage);
            fs_1["default"].writeFileSync(dataFilePath, JSON.stringify(data));
            return [2 /*return*/, data.messages];
        });
    });
}
function getMessages() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs_1["default"].readFile("data.json", "utf8", function (err, data) {
                        if (err)
                            throw err;
                        var jsonData = JSON.parse(data);
                        console.log(jsonData);
                        resolve(jsonData);
                    });
                })];
        });
    });
}
function llmCompletion(prompt, context, modelId) {
    if (context === void 0) { context = null; }
    if (modelId === void 0) { modelId = null; }
    return __awaiter(this, void 0, void 0, function () {
        var model, embeddings, axiosConfig, browser, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    model = new openai_2.ChatOpenAI({
                        temperature: 0.2,
                        openAIApiKey: process.env.OPENAI_API_KEY,
                        modelName: "gpt-3.5-turbo"
                    });
                    embeddings = new openai_3.OpenAIEmbeddings({
                        verbose: false,
                        openAIApiKey: process.env.OPENAI_API_KEY,
                        modelName: "text-embedding-ada-002"
                    });
                    axiosConfig = {
                        headers: {}
                    };
                    browser = new webbrowser_1.WebBrowser({ model: model, embeddings: embeddings });
                    console.log("browser", browser);
                    return [4 /*yield*/, browser.call("\"https://www.york.ac.uk/teaching/cws/wws/webpage1.html\",\"who is joseph campbell\"")];
                case 1:
                    result = _a.sent();
                    console.log(result);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1.response, error_1.response.data);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.llmCompletion = llmCompletion;
function chatLLMCompletion(prompt, context, modelId) {
    if (context === void 0) { context = null; }
    if (modelId === void 0) { modelId = null; }
    return __awaiter(this, void 0, void 0, function () {
        var tools, _a, agent, result, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = [new tools_1.RequestsGetTool(),
                        new tools_1.RequestsPostTool()];
                    return [4 /*yield*/, tools_1.AIPluginTool.fromPluginUrl("https://www.klarna.com/.well-known/ai-plugin.json")];
                case 1:
                    tools = _a.concat([
                        _b.sent()
                    ]);
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, (0, agents_1.initializeAgentExecutorWithOptions)(tools, new openai_2.ChatOpenAI({
                            cache: false,
                            temperature: 0,
                            openAIApiKey: process.env.OPENAI_API_KEY,
                            modelName: "text-davinci-003",
                            modelKwargs: {
                                max_tokens: 2000,
                                n: 1,
                                stop: null,
                                temperature: 0.7
                            }
                        }), { agentType: "chat-zero-shot-react-description", verbose: true })];
                case 3:
                    agent = _b.sent();
                    console.log(agent);
                    return [4 /*yield*/, agent.call({
                            input: "what t shirts are available in klarna?",
                            context: null
                        })];
                case 4:
                    result = _b.sent();
                    console.log({ result: result });
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _b.sent();
                    console.log(error_2, error_2.response, error_2.response.data);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.chatLLMCompletion = chatLLMCompletion;
function chatCompletion(prompt, context, modelId) {
    if (context === void 0) { context = null; }
    if (modelId === void 0) { modelId = null; }
    return __awaiter(this, void 0, void 0, function () {
        var messageContext, messages, completion, reply;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!context) return [3 /*break*/, 2];
                    messageContext = {
                        role: "system",
                        content: context
                    };
                    return [4 /*yield*/, addMessage(messageContext)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, addMessage({ role: "user", content: prompt })];
                case 3:
                    messages = _a.sent();
                    console.log("Prompting model...\n");
                    return [4 /*yield*/, openaiClient.chatCompletions
                            .create({
                            model: "gpt-3.5-turbo",
                            messages: messages,
                            max_tokens: 2000,
                            n: 1,
                            stop: null,
                            temperature: 0.7
                        })["catch"](function (err) {
                            var _a, _b;
                            console.error("Error keys:", Object.keys(err));
                            console.error("error", err);
                            console.error("error message", err.response ? (_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error : "no error message");
                        })];
                case 4:
                    completion = _a.sent();
                    if (!completion)
                        return [2 /*return*/, null];
                    reply = completion.data.choices[0].message.content.trim();
                    return [4 /*yield*/, addMessage({ role: "assistant", content: reply })];
                case 5:
                    _a.sent();
                    return [2 /*return*/, reply];
            }
        });
    });
}
exports.chatCompletion = chatCompletion;
