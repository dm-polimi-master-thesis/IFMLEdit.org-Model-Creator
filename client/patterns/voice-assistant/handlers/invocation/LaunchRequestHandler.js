const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        var speechText = 'Welcome to IFML model creator!',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        sessionAttributes.welcome = true;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

exports.LaunchRequestHandler = LaunchRequestHandler;
