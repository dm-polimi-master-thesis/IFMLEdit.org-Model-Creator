const SetEventTypeModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SetEventTypeModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            eventName = handlerInput.requestEnvelope.request.intent.slots.eventName.value,
            eventType = handlerInput.requestEnvelope.request.intent.slots.eventType.value ? handlerInput.requestEnvelope.request.intent.slots.eventType.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            message;

        if (eventType) {
            message = 'Set event type to ' + eventType;
            if (eventName && eventType) {
                message += ' of ' + eventName + ' event';
            }

            sessionAttributes.notify = {
                message: message,
                messageType: 'success'
            };
            sessionAttributes.advanced = {
                operation: 'set-type',
                options: {
                    type: eventType,
                    element: eventName
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

exports.SetEventTypeModelIntentHandler = SetEventTypeModelIntentHandler;
