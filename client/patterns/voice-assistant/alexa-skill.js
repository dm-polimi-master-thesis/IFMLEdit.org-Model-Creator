var Alexa = require('ask-sdk-core'),
    getModel = require('./index.js').getModel;

const itemInterceptor = {
    process(handlerInput) {
        return new Promise((resolve, reject) => {
            var attributes = handlerInput.attributesManager.getSessionAttributes();
            if (!(attributes.model) && !(handlerInput.requestEnvelope.request.intent.name === 'DemoIntent')) {
                attributes.model = getModel();
                handlerInput.attributesManager.setSessionAttributes(attributes);
                resolve();
            } else {
                console.log("Items is present");
                resolve();
            }
        });
    },
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome to IFML model creator!';
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.model.patterns = ['a','b','c'];

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const StartCreateModelIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'StartCreateModelIntent';
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const speechText = 'Hello from IFML Model Creator! The model type is: ';

        var model = sessionAttributes.model;

            model.comment = 'Well done!';

        return handlerInput.responseBuilder
            .speak(speechText + model.type)
            .getResponse();
    }
};

const DemoIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'DemoIntent';
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const speechText = 'With great pleasure! Visualize the model in IFMLEdit!';

        var model = sessionAttributes.model;

        model.state = 'demo';

        return handlerInput.responseBuilder
            .speak(speechText + model.type)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        StartCreateModelIntent,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addRequestInterceptors(itemInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();
