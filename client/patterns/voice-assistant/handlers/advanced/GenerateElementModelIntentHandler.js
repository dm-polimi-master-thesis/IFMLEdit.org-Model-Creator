const GenerateElementModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GenerateElementModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            name = handlerInput.requestEnvelope.request.intent.slots.name.value,
            type = handlerInput.requestEnvelope.request.intent.slots.type.value ? handlerInput.requestEnvelope.request.intent.slots.type.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            message;

        if (type !== 'view container' && type !== 'action') {
            sessionAttributes.notify = {
                message: 'You try to generate an element that require to be insert inside a parent. Use insert command instead.',
                messageType: 'danger',
                advanced: true
            };

            return handlerInput.responseBuilder
                .speak('You try to generate an element that require to be insert inside a parent. Use insert command instead.')
                .withShouldEndSession(false)
                .getResponse();
        }

        if (name && type) {
            message = 'Generate new ' + name + ' ' + type;

            sessionAttributes.notify = {
                message: message,
                messageType: 'success'
            };
            sessionAttributes.advanced = {
                operation: 'generate',
                options: {
                    name: name,
                    type: type
                }
            }

            return handlerInput.responseBuilder
                .speak('done')
                .withShouldEndSession(false)
                .getResponse();
        } else {
            sessionAttributes.notify = {
                message: 'Specify all the information needed to generate the new element.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.GenerateElementModelIntentHandler = GenerateElementModelIntentHandler;
