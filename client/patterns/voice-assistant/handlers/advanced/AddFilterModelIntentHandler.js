const AddFilterModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AddFilterModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            filterName = handlerInput.requestEnvelope.request.intent.slots.filterName.value,
            elementName = handlerInput.requestEnvelope.request.intent.slots.elementName.value,
            message;

        if (filterName) {
            message = 'Add filter ' + filterName;

            if (elementName) {
                message += ' to ' + elementName + ' list';
            }

            sessionAttributes.notify = {
                message: message,
                messageType: 'success',
                advanced: true
            };
            sessionAttributes.advanced = {
                operation: 'add-filter',
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
                message: 'Specify the name of the filter you want to add.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.AddFilterModelIntentHandler = AddFilterModelIntentHandler;
