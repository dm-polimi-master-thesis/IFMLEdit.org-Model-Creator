const RemoveBindingModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RemoveBindingModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            input = handlerInput.requestEnvelope.request.intent.slots.input.value,
            output = handlerInput.requestEnvelope.request.intent.slots.output.value,
            elementName = handlerInput.requestEnvelope.request.intent.slots.element.value,
            elementType = handlerInput.requestEnvelope.request.intent.slots.type.value ? handlerInput.requestEnvelope.request.intent.slots.type.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            message;

        if (input && output) {
            message = 'Remove binding with input' + input + ' and output ' + output;

            if (elementName && elementType) {
                message += ' to ' + elementName + ' ' + elementType;
            }

            sessionAttributes.notify = {
                message: message,
                messageType: 'success',
                advanced: true
            };
            sessionAttributes.advanced = {
                operation: 'remove-binding',
                options: {
                    input: input,
                    output: output,
                    element: elementName,
                    elementType: elementType
                }
            }
            return handlerInput.responseBuilder
                .speak('done')
                .withShouldEndSession(false)
                .getResponse();
        } else {
            sessionAttributes.notify = {
                message: 'Specify the input and output fields of the binding you want to remove.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.RemoveBindingModelIntentHandler = RemoveBindingModelIntentHandler;
