const GuidedModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.process.value
            && handlerInput.requestEnvelope.request.intent.slots.process.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'guided'
            && !handlerInput.requestEnvelope.request.intent.slots.purpose.value;
    },
    handle(handlerInput) {
        var speechText = 'What is the primary purpose of the application? Show and sell products, share contents or ask people to collaborate on some projects?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'What is the primary purpose?'
        };

        sessionAttributes.model = {
            type: '',
            pattern: [],
        };

        sessionAttributes.welcome = false;
        sessionAttributes.guided = true;

        sessionAttributes.state = 'IN_PROGRESS';

        return handlerInput.responseBuilder
            .addDelegateDirective()
            .getResponse();
    }
};

exports.GuidedModelIntentHandler = GuidedModelIntentHandler;
