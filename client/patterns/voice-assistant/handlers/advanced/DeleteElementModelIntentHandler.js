const DeleteElementModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'DeleteElementModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            name = handlerInput.requestEnvelope.request.intent.slots.name.value,
            type = handlerInput.requestEnvelope.request.intent.slots.type.value ? handlerInput.requestEnvelope.request.intent.slots.type.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            message = 'Delete';

        if (name && !type) {
            sessionAttributes.notify = {
                message: 'What is the type of the element you want to delete?',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .speak('What is the type of the element you want to delete?')
                .addElicitSlotDirective('type')
                .getResponse();
        } else if (!name && type) {
            sessionAttributes.notify = {
                message: 'What is the name of the element you want to delete?',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .speak('What is the name of the element you want to delete?')
                .addElicitSlotDirective('name')
                .getResponse();
        }

        if (name && type) {
            message += ' ' + name + ' ' + type;
        }

        sessionAttributes.notify = {
            message: message,
            messageType: 'success'
        };
        sessionAttributes.advanced = {
            operation: 'delete',
            options: {
                name: name,
                type: type
            }
        }

        return handlerInput.responseBuilder
            .speak('done')
            .withShouldEndSession(false)
            .getResponse();
    }
};

exports.DeleteElementModelIntentHandler = DeleteElementModelIntentHandler;
