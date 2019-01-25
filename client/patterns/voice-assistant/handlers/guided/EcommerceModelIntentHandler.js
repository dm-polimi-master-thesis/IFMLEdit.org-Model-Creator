const EcommerceModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.purpose.value
            && handlerInput.requestEnvelope.request.intent.slots.purpose.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'show and sell products'
            && !handlerInput.attributesManager.getSessionAttributes().nextStep;
    },
    handle(handlerInput) {
        var speechText = 'The products that you intend to sell are homogeneous or require to be divided into categories and sub-categories?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'E-commerce',
            messageType: 'success'
        };

        sessionAttributes.model.type = 'e-commerce';
        sessionAttributes.nextStep = 'master-details-pattern-handler';

        return handlerInput.responseBuilder
            .speak(speechText)
            .addElicitSlotDirective('masterDetailsPattern')
            .getResponse();
    }
};

exports.EcommerceModelIntentHandler = EcommerceModelIntentHandler;
