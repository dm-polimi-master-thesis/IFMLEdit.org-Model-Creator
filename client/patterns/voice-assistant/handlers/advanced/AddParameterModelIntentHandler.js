const AddParameterModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AddParameterModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            parameterName = handlerInput.requestEnvelope.request.intent.slots.parameterName.value,
            elementName = handlerInput.requestEnvelope.request.intent.slots.elementName.value,
            message;

        if (parameterName) {
            message = 'Add parameter ' + parameterName;

            if (elementName) {
                message += ' to ' + elementName + ' action';
            }

            sessionAttributes.notify = {
                message: message,
                messageType: 'success'
            };
            sessionAttributes.advanced = {
                operation: 'add-parameter',
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
                message: 'Specify the name of the parameter you want to add.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.AddParameterModelIntentHandler = AddParameterModelIntentHandler;
