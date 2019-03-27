const RemoveFilterModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RemoveFilterModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            filterName = handlerInput.requestEnvelope.request.intent.slots.filterName.value,
            elementName = handlerInput.requestEnvelope.request.intent.slots.elementName.value,
            message;

        if (filterName) {
            message = 'Remove filter ' + filterName;

            if (elementName) {
                message += ' from ' + elementName + ' list';
            }

            sessionAttributes.notify = {
                message: message,
                messageType: 'success',
                advanced: true
            };
            sessionAttributes.advanced = {
                operation: 'remove-filter',
                options: {
                    name: filterName,
                    element: elementName
                }
            }
            return handlerInput.responseBuilder
                .speak('done')
                .withShouldEndSession(false)
                .getResponse();
        } else {
            sessionAttributes.notify = {
                message: 'Specify the name of the filter you want to remove.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.RemoveFilterModelIntentHandler = RemoveFilterModelIntentHandler;
