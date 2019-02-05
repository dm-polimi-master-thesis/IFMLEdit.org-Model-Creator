const AddResultModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AddResultModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            resultName = handlerInput.requestEnvelope.request.intent.slots.resultName.value,
            elementName = handlerInput.requestEnvelope.request.intent.slots.elementName.value,
            message;

        if (resultName) {
            message = 'Add result ' + resultName;

            if (elementName) {
                message += ' to ' + elementName + ' action';
            }

            sessionAttributes.notify = {
                message: message,
                messageType: 'success'
            };
            sessionAttributes.advanced = {
                operation: 'add-result',
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
                message: 'Specify the name of the result you want to add.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.AddResultModelIntentHandler = AddResultModelIntentHandler;
