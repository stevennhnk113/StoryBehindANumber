import * as Alexa from 'ask-sdk';

import { services, IntentRequest } from "ask-sdk-model";

// Helper
import { Handler, NumberSlot } from "./Constant";
import { ConfigBase } from 'aws-sdk/lib/config';
import { AddBreak } from './SpeechHelper';

var request = require('request-promise');

const LaunchRequestHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
	},
	async handle(handlerInput: Alexa.HandlerInput) {
		var speechText = "";
		
		speechText += "Hi there, what number do you want the wizard to tell you about?";

		handlerInput.attributesManager.setSessionAttributes(
			{
				YesHandler: Handler.GetNumberStoryIntentHandler,
				NoHandler: Handler.GoodByeIntentHandler
			}
		);

		return handlerInput.responseBuilder
			.speak(speechText)
			.withShouldEndSession(false)
			.getResponse();
	}
};

const GetNumberStoryIntentHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& handlerInput.requestEnvelope.request.intent.name === 'GetPokemonIntent';
	},
	async handle(handlerInput: Alexa.HandlerInput) {
		let speechText = '';

		const { requestEnvelope } = handlerInput;
		const intentRequest = requestEnvelope.request as IntentRequest;

		if (intentRequest.intent.slots[NumberSlot].value == null) {
			return handlerInput.responseBuilder
				.addDelegateDirective()
				.getResponse();
		}

		const userNumber = intentRequest.intent.slots[NumberSlot].value;
		speechText = await GetNumberStory(userNumber);
		speechText = AddBreak(speechText);
		speechText += "Do you want to hear a story about another number?";

		handlerInput.attributesManager.setSessionAttributes(
			{
				YesHandler: Handler.GetNumberStoryIntentHandler,
				NoHandler: Handler.GoodByeIntentHandler
			}
		);

		return handlerInput.responseBuilder
			.speak(speechText)
			.withShouldEndSession(false)
			.getResponse();
	}
};

function GetNumberStory(num: string): Promise<string> {
	return new Promise((resolve, reject) => {
		request({
			"method": "GET",
			"uri": "http://numbersapi.com/" + num,
			"json": true,
		})
		.then((data:any) => {
			resolve(data);
		})
		.catch((error: any) => {
			reject();
		})
	});
}

const HelpIntentHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
	},
	handle(handlerInput: Alexa.HandlerInput) {
		let speechText = "When you tell the wizard a number, the wizard will tell you a small story about that number";

		speechText += "What number do you want to learn about today?";

		handlerInput.attributesManager.setSessionAttributes(
			{
				YesHandler: Handler.GetNumberStoryIntentHandler,
				NoHandler: Handler.GoodByeIntentHandler
			}
		);

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.withShouldEndSession(false)
			.getResponse();
	}
};

const CancelAndStopIntentHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
				|| handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
	},
	handle(handlerInput: Alexa.HandlerInput) {
		const speechText = 'Goodbye and be yourself today!';

		return handlerInput.responseBuilder
			.speak(speechText)
			.withSimpleCard(speechText, speechText)
			.getResponse();
	}
};

const YesIntentHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent');
	},
	handle(handlerInput: Alexa.HandlerInput) {
		let sessionAttributes =  handlerInput.attributesManager.getSessionAttributes();

		switch(sessionAttributes.YesHandler)
		{
			case Handler.GetNumberStoryIntentHandler:
				return GetNumberStoryIntentHandler.handle(handlerInput);
			default:
				var speechText = "Sorry! We encounter a problem.";

				return handlerInput.responseBuilder
				.speak(speechText)
				.getResponse();
		}
	}
};

const NoIntentHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent');
	},
	handle(handlerInput: Alexa.HandlerInput) {
		let sessionAttributes =  handlerInput.attributesManager.getSessionAttributes();

		switch(sessionAttributes.NoHandler)
		{
			case Handler.GoodByeIntentHandler:
				return GoodByeIntentHandler.handle(handlerInput);
			default:
				var speechText = "Sorry! We encounter a problem.";

				return handlerInput.responseBuilder
				.speak(speechText)
				.getResponse();
		}
	}
};

const SessionEndedRequestHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
	},
	handle(handlerInput: Alexa.HandlerInput) {
		//any cleanup logic goes here

		return handlerInput.responseBuilder.getResponse();
	}
};

// Internal Handler
const GoodByeIntentHandler = {
	canHandle(handlerInput: Alexa.HandlerInput) {
		return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
	},
	handle(handlerInput: Alexa.HandlerInput) {
		let speechText = 'GoodBye!';

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
	.addRequestHandlers(LaunchRequestHandler,
		GetNumberStoryIntentHandler,
		HelpIntentHandler,
		CancelAndStopIntentHandler,
		YesIntentHandler,
		NoIntentHandler,
		SessionEndedRequestHandler)
	//.withTableName("StoryBehindANumber")
	//.withAutoCreateTable(true)
	.lambda(); 