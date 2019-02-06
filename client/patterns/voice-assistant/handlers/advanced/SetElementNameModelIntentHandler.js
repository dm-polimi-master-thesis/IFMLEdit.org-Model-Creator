const SetElementNameModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SetElementNameModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            name = handlerInput.requestEnvelope.request.intent.slots.name.value,
            elementName = handlerInput.requestEnvelope.request.intent.slots.elementName.value,
            elementType = handlerInput.requestEnvelope.request.intent.slots.elementType.value ? handlerInput.requestEnvelope.request.intent.slots.elementType.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            message;

        if (name) {
            message = 'Assign name ' + name;

            if (elementName && elementType) {
                message += ' of ' + elementName + ' ' + elementType;
            }

            sessionAttributes.notify = {
                message: message,
                messageType: 'success'
            };
            sessionAttributes.advanced = {
                operation: 'set-name',
                options: {
                    name: name,
                    element: elementName,
                    type: elementType
                }
            }
            return handlerInput.responseBuilder
                .speak('done')
                .withShouldEndSession(false)
                .getResponse();
        } else {

            sessionAttributes.notify = {
                message: 'Specify the new name of the element.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.SetElementNameModelIntentHandler = SetElementNameModelIntentHandler;
