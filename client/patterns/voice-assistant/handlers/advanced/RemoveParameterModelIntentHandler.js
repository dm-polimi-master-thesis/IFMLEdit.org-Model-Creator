const RemoveParameterModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RemoveParameterModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            parameterName = handlerInput.requestEnvelope.request.intent.slots.parameterName.value,
            elementName = handlerInput.requestEnvelope.request.intent.slots.elementName.value,
            message;

        if (parameterName) {
            message = 'Remove attribute ' + parameterName;

            if (elementName) {
                message += ' from ' + elementName + ' action';
            }

            sessionAttributes.notify = {
                message: message,
                messageType: 'success'
            };
            sessionAttributes.advanced = {
                operation: 'remove-parameter',
                options: {
                    name: parameterName,
                    element: elementName
                }
            }
            return handlerInput.responseBuilder
                .speak('done')
                .withShouldEndSession(false)
                .getResponse();
        } else {
            sessionAttributes.notify = {
                message: 'Specify the name of the parameter you want to remove.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.RemoveParameterModelIntentHandler = RemoveParameterModelIntentHandler;
