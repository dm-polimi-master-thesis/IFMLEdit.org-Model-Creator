const InsertElementModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'InsertElementModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            name = handlerInput.requestEnvelope.request.intent.slots.name.value,
            child = handlerInput.requestEnvelope.request.intent.slots.child.value,
            parent = handlerInput.requestEnvelope.request.intent.slots.parent.value,
            type = handlerInput.requestEnvelope.request.intent.slots.type.value ? handlerInput.requestEnvelope.request.intent.slots.type.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            position = handlerInput.requestEnvelope.request.intent.slots.position.value ? handlerInput.requestEnvelope.request.intent.slots.position.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            childType = handlerInput.requestEnvelope.request.intent.slots.childType.value ? handlerInput.requestEnvelope.request.intent.slots.childType.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            message;

        if (name && type && parent) {
            var message = 'Insert ' + name + ' ' + type + ' inside ' + parent;

            sessionAttributes.notify = {
                message: message,
                messageType: 'success'
            };
            sessionAttributes.advanced = {
                operation: 'insert',
                options: {
                    name: name,
                    child: child,
                    parent: parent,
                    type: type,
                    childType: childType,
                    position: position
                }
            }
            return handlerInput.responseBuilder
                .speak('done')
                .withShouldEndSession(false)
                .getResponse();
        } else {
            sessionAttributes.notify = {
                message: 'You forgot to provide non negligible information. The name and the type of the element and the name of the parent view container are required information. In addition, you can define the position respect to an other element of the view container',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .speak('You forgot to provide non negligible information. The name and the type of the element and the name of the parent view container are required information. In addition, you can define the position respect to an other element of the view container')
                .getResponse();
        }
    }
};

exports.InsertElementModelIntentHandler = InsertElementModelIntentHandler;
