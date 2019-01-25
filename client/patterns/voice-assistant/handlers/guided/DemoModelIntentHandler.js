const DemoModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'DemoModelIntent';
    },
    handle(handlerInput) {
        var speechText = 'With great pleasure! Visualize the model in IFMLEdit!',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'Demo!',
            messageType: 'success'
        };

        sessionAttributes.demo = {
            template: 'demo'
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

exports.DemoModelIntentHandler = DemoModelIntentHandler;
