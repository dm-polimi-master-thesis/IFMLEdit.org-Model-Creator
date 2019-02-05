const InsertEventModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'InsertEventModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            name = handlerInput.requestEnvelope.request.intent.slots.name.value,
            parent = handlerInput.requestEnvelope.request.intent.slots.parent.value,
            type = handlerInput.requestEnvelope.request.intent.slots.type.value ? handlerInput.requestEnvelope.request.intent.slots.type.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            position = handlerInput.requestEnvelope.request.intent.slots.position.value ? handlerInput.requestEnvelope.request.intent.slots.position.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            message;

        if (name) {
            message = 'Insert ' + name + ' event';
        } else {
            message = 'Insert event';
        }

        if (parent && type) {
            message += ' inside ' + parent + ' ' + type;
        }

        sessionAttributes.notify = {
            message: message,
            messageType: 'success'
        };
        sessionAttributes.advanced = {
            operation: 'insert-event',
            options: {
                name: name,
                parent: parent,
                type: type,
                position: position
            }
        }
        return handlerInput.responseBuilder
            .speak('done')
            .withShouldEndSession(false)
            .getResponse();
    }
};

exports.InsertEventModelIntentHandler = InsertEventModelIntentHandler;
