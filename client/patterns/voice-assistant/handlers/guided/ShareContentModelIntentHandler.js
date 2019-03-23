const ShareContentModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.purpose.value
            && handlerInput.requestEnvelope.request.intent.slots.purpose.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'share'
            && !handlerInput.requestEnvelope.request.intent.slots.sharing.value
            && !handlerInput.attributesManager.getSessionAttributes().nextStep;
    },
    handle(handlerInput) {
        var speechText = 'What type of content users can share, posts or articles?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'What type of content users can share?'
        };

        return handlerInput.responseBuilder
            .speak(speechText)
            .addElicitSlotDirective('sharing')
            .getResponse();
    }
}

exports.ShareContentModelIntentHandler = ShareContentModelIntentHandler;
