const GenerateViewContainerModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GenerateViewContainerModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            name = handlerInput.requestEnvelope.request.intent.slots.name.value
            properties = handlerInput.requestEnvelope.request.intent.slots.properties.value ? handlerInput.requestEnvelope.request.intent.slots.properties.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            parent = handlerInput.requestEnvelope.request.intent.slots.properties.value,
            message;

        if (name) {
            var message = 'New ';

            if (properties) {
                message += properties + ' '
            }

            message += 'View Container with name ' + name;

            if (parent) {
                message += 'and parent' + parent
            }

            sessionAttributes.notify = {
                message: message,
                messageType: 'success'
            };
            sessionAttributes.advanced = {
                operation: 'generate-view-container',
                options: {
                    name: name,
                    properties: properties,
                    parent: parent
                }
            }
            return handlerInput.responseBuilder
                .speak('done')
                .withShouldEndSession(false)
                .getResponse();
        } else {
            sessionAttributes.notify = {
                message: 'Specify the name of the new View Container',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.GenerateViewContainerModelIntentHandler = GenerateViewContainerModelIntentHandler;
