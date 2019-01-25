const SocialNetworkModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.purpose.value
            && handlerInput.requestEnvelope.request.intent.slots.purpose.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'share'
            && handlerInput.requestEnvelope.request.intent.slots.sharing.value
            && handlerInput.requestEnvelope.request.intent.slots.sharing.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'posts'
            && !handlerInput.attributesManager.getSessionAttributes().nextStep;
    },
    handle(handlerInput) {
        var speechText = 'Can user comment posts or they can only visualize them?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'Social Network',
            messageType: 'success'
        };

        sessionAttributes.model.type = 'social-network';
        sessionAttributes.nextStep = 'comment-content-management-pattern-handler';

        return handlerInput.responseBuilder
            .speak(speechText)
            .addElicitSlotDirective('commentPolicy')
            .getResponse();
    }
}

exports.SocialNetworkModelIntentHandler = SocialNetworkModelIntentHandler;
