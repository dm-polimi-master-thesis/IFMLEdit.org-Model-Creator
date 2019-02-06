const SetContainerModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SetContainerModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            elementName = handlerInput.requestEnvelope.request.intent.slots.elementName.value,
            operation = handlerInput.requestEnvelope.request.intent.slots.operation.value ? handlerInput.requestEnvelope.request.intent.slots.operation.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            property = handlerInput.requestEnvelope.request.intent.slots.property.value ? handlerInput.requestEnvelope.request.intent.slots.property.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            message;

        if (operation && property) {
            message = 'Set ' + property;
            if (elementName) {
                message += ' of ' + elementName + ' view container';
            }

            sessionAttributes.notify = {
                message: message,
                messageType: 'success'
            };
            sessionAttributes.advanced = {
                operation: 'set-container',
                options: {
                    operation: operation,
                    property: property,
                    element: elementName
                }
            }
            return handlerInput.responseBuilder
                .speak('done')
                .withShouldEndSession(false)
                .getResponse();
        } else {
            sessionAttributes.notify = {
                message: 'Specify the operation and the property you want to set.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.SetContainerModelIntentHandler = SetContainerModelIntentHandler;
