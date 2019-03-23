const BlogModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.purpose.value
            && handlerInput.requestEnvelope.request.intent.slots.purpose.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'share'
            && handlerInput.requestEnvelope.request.intent.slots.sharing.value
            && handlerInput.requestEnvelope.request.intent.slots.sharing.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'articles'
            && !handlerInput.attributesManager.getSessionAttributes().nextStep;
    },
    handle(handlerInput) {
        var speechText = 'Articles are homogeneous or heterogeneous?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'Are the articles relative to the same topic or they can divided in categories and sub-categories?',
            guided: true,
            purpose: 'blog'
        };

        sessionAttributes.model.type = 'blog';
        sessionAttributes.nextStep = 'master-details-pattern-handler';

        return handlerInput.responseBuilder
            .speak(speechText)
            .addElicitSlotDirective('masterDetailsPattern')
            .getResponse();
    }
}

exports.BlogModelIntentHandler = BlogModelIntentHandler;
