const CreateModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && !handlerInput.requestEnvelope.request.intent.slots.process.value;
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'Let\'s start!'
        };

        sessionAttributes.welcome = false;

        return handlerInput.responseBuilder
            .addDelegateDirective()
            .getResponse();
    }
};

exports.CreateModelIntentHandler = CreateModelIntentHandler;
