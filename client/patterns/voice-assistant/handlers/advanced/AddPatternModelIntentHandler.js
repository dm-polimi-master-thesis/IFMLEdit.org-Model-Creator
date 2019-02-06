const AddPatternModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AddPatternModelIntent'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('done')
            .withShouldEndSession(false)
            .getResponse();
    }
};

exports.AddPatternModelIntentHandler = AddPatternModelIntentHandler;
