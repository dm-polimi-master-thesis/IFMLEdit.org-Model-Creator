const SetCollectionModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SetCollectionModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            collectionName = handlerInput.requestEnvelope.request.intent.slots.collectionName.value,
            elementName = handlerInput.requestEnvelope.request.intent.slots.elementName.value,
            elementType = handlerInput.requestEnvelope.request.intent.slots.elementType.value ? handlerInput.requestEnvelope.request.intent.slots.elementType.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            message;

        if (collectionName) {
            message = 'Assign name ' + collectionName + ' to collection';

            if (elementName && elementType) {
                message += ' of ' + elementName + ' ' + elementType;
            }

            sessionAttributes.notify = {
                message: message,
                messageType: 'success'
            };
            sessionAttributes.advanced = {
                operation: 'set-collection',
                options: {
                    name: collectionName,
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
                message: 'Specify the collection name.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.SetCollectionModelIntentHandler = SetCollectionModelIntentHandler;
