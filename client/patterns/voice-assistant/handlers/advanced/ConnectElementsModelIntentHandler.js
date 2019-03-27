const ConnectElementsModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ConnectElementsModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            source = handlerInput.requestEnvelope.request.intent.slots.source.value,
            destination = handlerInput.requestEnvelope.request.intent.slots.destination.value,
            sourceType = handlerInput.requestEnvelope.request.intent.slots.sourceType.value ? handlerInput.requestEnvelope.request.intent.slots.sourceType.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            destinationType = handlerInput.requestEnvelope.request.intent.slots.destinationType.value ? handlerInput.requestEnvelope.request.intent.slots.destinationType.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            message = 'Connect ';

        if (source && !sourceType) {
            sessionAttributes.notify = {
                message: 'What is the type of the source element you want to connect?',
                messageType: 'warning',
                advanced: true
            };
            return handlerInput.responseBuilder
                .speak('What is the type of the source element you want to connect?')
                .addElicitSlotDirective('sourceType')
                .getResponse();
        } else if (!source && sourceType) {
            sessionAttributes.notify = {
                message: 'What is the name of the source element you want to connect?',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .speak('What is the name of the source element you want to connect?')
                .addElicitSlotDirective('source')
                .getResponse();
        }

        if (destination && destinationType) {
            if (source && sourceType) {
                message += source + ' ' + sourceType + ' ';
            }

            message += 'to ' + destination + ' ' + destinationType;

            sessionAttributes.notify = {
                message: message,
                messageType: 'success'
            };
            sessionAttributes.advanced = {
                operation: 'connect-elements',
                options: {
                    source: source,
                    sourceType: sourceType,
                    destination: destination,
                    destinationType: destinationType
                }
            }

            return handlerInput.responseBuilder
                .speak('done')
                .withShouldEndSession(false)
                .getResponse();
        } else {
            sessionAttributes.notify = {
                message: 'Specify all the information needed to generate the new element.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.ConnectElementsModelIntentHandler = ConnectElementsModelIntentHandler;
