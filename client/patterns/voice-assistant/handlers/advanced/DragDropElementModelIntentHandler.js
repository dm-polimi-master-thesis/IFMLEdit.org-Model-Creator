const DragDropElementModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'DragDropElementModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            name = handlerInput.requestEnvelope.request.intent.slots.name.value,
            type = handlerInput.requestEnvelope.request.intent.slots.type.value ? handlerInput.requestEnvelope.request.intent.slots.type.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            firstDirection = handlerInput.requestEnvelope.request.intent.slots.firstDirection.value ? handlerInput.requestEnvelope.request.intent.slots.firstDirection.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            firstDelta = handlerInput.requestEnvelope.request.intent.slots.firstDelta.value ? handlerInput.requestEnvelope.request.intent.slots.firstDelta.value : undefined,
            secondDirection = handlerInput.requestEnvelope.request.intent.slots.secondDirection.value ? handlerInput.requestEnvelope.request.intent.slots.secondDirection.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            secondDelta = handlerInput.requestEnvelope.request.intent.slots.secondDelta.value ? handlerInput.requestEnvelope.request.intent.slots.secondDelta.value : undefined,
            message = 'Drag and drop ';

        if (name && type) {
            message += name + ' ' + type;
        }
        if (firstDirection && firstDelta) {
            firstDelta = firstDelta / 10 > 0 ? (firstDelta - (firstDelta % 10)) : 10;
            message += firstDirection + ' for ' + firstDelta + ' px';
        } else {
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
        if (secondDirection && secondDelta) {
            secondDelta = secondDelta / 10 > 0 ? (secondDelta - (secondDelta % 10)) : 10;
            message += ' and ' + secondDirection + ' for ' + secondDelta + ' px';
        }

        sessionAttributes.notify = {
            message: message,
            messageType: 'success'
        };
        sessionAttributes.advanced = {
            operation: 'drag-and-drop',
            options: {
                name: name,
                type: type,
                firstDirection: firstDirection,
                firstDelta: firstDelta,
                secondDirection: secondDirection,
                secondDelta: secondDelta
            }
        }
        return handlerInput.responseBuilder
            .speak('done')
            .withShouldEndSession(false)
            .getResponse();
    }
};

exports.DragDropElementModelIntentHandler = DragDropElementModelIntentHandler;
