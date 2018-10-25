"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Alexa = __importStar(require("ask-sdk"));
// Helper
var Constant_1 = require("./Constant");
var SpeechHelper_1 = require("./SpeechHelper");
var request = require('request-promise');
var LaunchRequestHandler = {
    canHandle: function (handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle: function (handlerInput) {
        return __awaiter(this, void 0, void 0, function () {
            var speechText;
            return __generator(this, function (_a) {
                speechText = "";
                speechText += "Hi there, what number do you want the wizard to tell you about?";
                handlerInput.attributesManager.setSessionAttributes({
                    YesHandler: Constant_1.Handler.GetNumberStoryIntentHandler,
                    NoHandler: Constant_1.Handler.GoodByeIntentHandler
                });
                return [2 /*return*/, handlerInput.responseBuilder
                        .speak(speechText)
                        .withShouldEndSession(false)
                        .getResponse()];
            });
        });
    }
};
var GetNumberStoryIntentHandler = {
    canHandle: function (handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GetNumberStoryIntent';
    },
    handle: function (handlerInput) {
        return __awaiter(this, void 0, void 0, function () {
            var speechText, requestEnvelope, intentRequest, userNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        speechText = '';
                        requestEnvelope = handlerInput.requestEnvelope;
                        intentRequest = requestEnvelope.request;
                        if (intentRequest.intent.slots == null ||
                            intentRequest.intent.slots[Constant_1.NumberSlot] == null ||
                            intentRequest.intent.slots[Constant_1.NumberSlot].value == null) {
                            return [2 /*return*/, handlerInput.responseBuilder
                                    .addDelegateDirective()
                                    .getResponse()];
                        }
                        userNumber = intentRequest.intent.slots[Constant_1.NumberSlot].value;
                        return [4 /*yield*/, GetNumberStory(userNumber)];
                    case 1:
                        speechText = _a.sent();
                        speechText = SpeechHelper_1.AddBreak(speechText);
                        speechText += "Do you want to hear a story about another number?";
                        handlerInput.attributesManager.setSessionAttributes({
                            YesHandler: Constant_1.Handler.GetNumberStoryIntentHandler,
                            NoHandler: Constant_1.Handler.GoodByeIntentHandler
                        });
                        return [2 /*return*/, handlerInput.responseBuilder
                                .speak(speechText)
                                .withShouldEndSession(false)
                                .getResponse()];
                }
            });
        });
    }
};
function GetNumberStory(num) {
    return new Promise(function (resolve, reject) {
        request({
            "method": "GET",
            "uri": "http://numbersapi.com/" + num,
            "json": true,
        })
            .then(function (data) {
            resolve(data);
        })
            .catch(function (error) {
            reject();
        });
    });
}
var HelpIntentHandler = {
    canHandle: function (handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle: function (handlerInput) {
        var speechText = "When you tell the wizard a number, the wizard will tell you a small story about that number";
        speechText += "What number do you want to learn about today?";
        handlerInput.attributesManager.setSessionAttributes({
            YesHandler: Constant_1.Handler.GetNumberStoryIntentHandler,
            NoHandler: Constant_1.Handler.GoodByeIntentHandler
        });
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};
var CancelAndStopIntentHandler = {
    canHandle: function (handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle: function (handlerInput) {
        var speechText = 'Goodbye and be yourself today!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(speechText, speechText)
            .getResponse();
    }
};
var YesIntentHandler = {
    canHandle: function (handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent');
    },
    handle: function (handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        switch (sessionAttributes.YesHandler) {
            case Constant_1.Handler.GetNumberStoryIntentHandler:
                return GetNumberStoryIntentHandler.handle(handlerInput);
            default:
                var speechText = "Sorry! We encounter a problem.";
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .getResponse();
        }
    }
};
var NoIntentHandler = {
    canHandle: function (handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent');
    },
    handle: function (handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        switch (sessionAttributes.NoHandler) {
            case Constant_1.Handler.GoodByeIntentHandler:
                return GoodByeIntentHandler.handle(handlerInput);
            default:
                var speechText = "Sorry! We encounter a problem.";
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .getResponse();
        }
    }
};
var SessionEndedRequestHandler = {
    canHandle: function (handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle: function (handlerInput) {
        //any cleanup logic goes here
        return handlerInput.responseBuilder.getResponse();
    }
};
// Internal Handler
var GoodByeIntentHandler = {
    canHandle: function (handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle: function (handlerInput) {
        var speechText = 'GoodBye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
// Lambda init
//var persistenceAdapterConfig = {
//tableName: "StoryBehindANumber",
//partitionKeyName: "id",
//createTable: true,
//attributesName: undefined,
//dynamoDBClient: undefined,
//partitionKeyGenerator: undefined
//};
//var persistenceAdapter = new Alexa.DynamoDbPersistenceAdapter(persistenceAdapterConfig);
exports.handler = Alexa.SkillBuilders.standard()
    .addRequestHandlers(LaunchRequestHandler, GetNumberStoryIntentHandler, HelpIntentHandler, CancelAndStopIntentHandler, YesIntentHandler, NoIntentHandler, SessionEndedRequestHandler)
    //.withTableName("StoryBehindANumber")
    //.withAutoCreateTable(true)
    .lambda();
