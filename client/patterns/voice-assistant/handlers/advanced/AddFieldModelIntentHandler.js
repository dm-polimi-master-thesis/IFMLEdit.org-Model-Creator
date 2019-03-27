const AddFieldModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AddFieldModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            fieldName = handlerInput.requestEnvelope.request.intent.slots.fieldName.value,
            elementName = handlerInput.requestEnvelope.request.intent.slots.elementName.value,
            fieldType = handlerInput.requestEnvelope.request.intent.slots.fieldType.value ? handlerInput.requestEnvelope.request.intent.slots.fieldType.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            elementType = handlerInput.requestEnvelope.request.intent.slots.elementType.value ? handlerInput.requestEnvelope.request.intent.slots.elementType.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            message;

        if (fieldName) {
            if (fieldType) {
                message = 'Add field ' + fieldName + ' of type ' + fieldType;
            } else {
                message = 'Add field ' + fieldName + ' of type text';
            }
            if (elementName && elementType) {
                message += ' to ' + elementName + ' ' + elementType;
            }

            sessionAttributes.notify = {
                message: message,
                messageType: 'success',
                advanced: true
            };
            sessionAttributes.advanced = {
                operation: 'add-field',
                options: {
                    name: fieldName,
                    element: elementName,
                    type: fieldType,
                    elementType: elementType
                }
            }
            return handlerInput.responseBuilder
                .speak('done')
                .withShouldEndSession(false)
                .getResponse();
        } else {
            sessionAttributes.notify = {
                message: 'Specify the name of the field you want to add.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.AddFieldModelIntentHandler = AddFieldModelIntentHandler;
