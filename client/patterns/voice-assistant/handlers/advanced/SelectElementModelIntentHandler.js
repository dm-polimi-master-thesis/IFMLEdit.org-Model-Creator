const SelectElementModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SelectElementModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            name = handlerInput.requestEnvelope.request.intent.slots.name.value,
            type = handlerInput.requestEnvelope.request.intent.slots.type.value ? handlerInput.requestEnvelope.request.intent.slots.type.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined;

        if (name && type) {
            message = 'Selected ' + name + ' ' + type;

            sessionAttributes.notify = {
                message: message,
                messageType: 'success',
                advanced: true
            };
            sessionAttributes.advanced = {
                operation: 'select-element',
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
            if (!name && type) {
                message = 'name'
            } else if (name && !type) {
                message = 'type'
            } else if (!name && !type) {
                message = 'name and type'
            }

            sessionAttributes.notify = {
                message: 'Specify ' + message + ' of the element that you want to select.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.SelectElementModelIntentHandler = SelectElementModelIntentHandler;
