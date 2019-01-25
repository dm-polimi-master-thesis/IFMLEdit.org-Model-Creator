const AdvancedModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.process.value
            && handlerInput.requestEnvelope.request.intent.slots.process.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'advanced'
    },
    handle(handlerInput) {
        var speechText = 'Let\'s start!',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'Build your advanced model!',
            messageType: 'success'
        };

        handlerInput.requestEnvelope.request.dialogState = "COMPLETED"

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

exports.AdvancedModelIntentHandler = AdvancedModelIntentHandler;
