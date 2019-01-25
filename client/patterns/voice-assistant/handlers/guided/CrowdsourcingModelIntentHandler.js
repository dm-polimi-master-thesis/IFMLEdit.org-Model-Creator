const CrowdsourcingModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.purpose.value
            && handlerInput.requestEnvelope.request.intent.slots.purpose.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'collaborate'
            && !handlerInput.attributesManager.getSessionAttributes().nextStep;
    },
    handle(handlerInput) {
        var speechText = 'Are users limited to perform tasks or some users can publish tasks?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'Crowdsourcing',
            messageType: 'success'
        };

        sessionAttributes.model.type = 'crowdsourcing';
        sessionAttributes.nextStep = 'crowd-policy-handler';

        return handlerInput.responseBuilder
            .speak(speechText)
            .addElicitSlotDirective('crowdPolicy')
            .getResponse();
    }
};

exports.CrowdsourcingModelIntentHandler = CrowdsourcingModelIntentHandler;
