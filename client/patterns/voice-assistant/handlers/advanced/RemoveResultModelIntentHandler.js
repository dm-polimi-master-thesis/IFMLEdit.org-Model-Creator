const RemoveResultModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RemoveResultModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            resultName = handlerInput.requestEnvelope.request.intent.slots.resultName.value,
            elementName = handlerInput.requestEnvelope.request.intent.slots.elementName.value,
            message;

        if (resultName) {
            message = 'Remove attribute ' + resultName;

            if (elementName) {
                message += ' from ' + elementName + ' action';
            }

            sessionAttributes.notify = {
                message: message,
                messageType: 'success'
            };
            sessionAttributes.advanced = {
                operation: 'remove-result',
                options: {
                    name: resultName,
                    element: elementName
                }
            }
            return handlerInput.responseBuilder
                .speak('done')
                .withShouldEndSession(false)
                .getResponse();
        } else {
            sessionAttributes.notify = {
                message: 'Specify the name of the result you want to remove.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.RemoveResultModelIntentHandler = RemoveResultModelIntentHandler;
