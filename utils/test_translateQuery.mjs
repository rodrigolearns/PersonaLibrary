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

var openai_1 = require("langchain/llms/openai");
var PersonaConfigurations_1 = require("../config/PersonaConfigurations");
function translateQuery(userQuery, activePersonas) {
    return __awaiter(this, void 0, void 0, function () {
        var model, activePersonasDetails, prompt, response, translatedQueries;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    model = new openai_1.OpenAI({
                        temperature: 0,
                        modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
                    });
                    activePersonasDetails = activePersonas.map(function (persona) {
                        var personaDetails = PersonaConfigurations_1.PersonaConfiguration.find(function (p) { return p.name === persona; });
                        if (!personaDetails) {
                            throw new Error("No configuration found for persona: ".concat(persona));
                        }
                        return personaDetails;
                    });
                    prompt = "\n    These are the personas trying to help the user with their query:\n    ".concat(activePersonasDetails.map(function (p) { return "".concat(p.name, ": ").concat(p.QA_PROMPT); }).join('\n'), "\n    The user's query is: \"").concat(userQuery, "\".\n    Please separate the query into subqueries and assign these subqueries to the most appropriate personas based on their QA_PROMPT.\n    The response should be in the format \"persona: subquery\" for each persona, and nothing else.\n  ");
                    return [4 /*yield*/, model.call(prompt)];
                case 1:
                    response = _a.sent();
                    translatedQueries = response.split('\n').reduce(function (acc, line) {
                        var _a = line.split(': '), persona = _a[0], subquery = _a[1];
                        if (!persona || !subquery) {
                            throw new Error("Unexpected response format from model: ".concat(line));
                        }
                        acc[persona] = subquery;
                        return acc;
                    }, {});
                    return [2 /*return*/, translatedQueries];
            }
        });
    });
}
// Test the function
var userQuery = "What is AD?";
var activePersonas = ["Eric Reits"]; // Replace with the names of the active personas
translateQuery(userQuery, activePersonas)
    .then(function (translatedQueries) { return console.log(translatedQueries); })
    .catch(function (error) { return console.error(error); });
