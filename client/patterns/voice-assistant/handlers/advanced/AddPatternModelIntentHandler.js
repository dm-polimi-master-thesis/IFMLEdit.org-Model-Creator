const AddPatternModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AddPatternModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            patternType = handlerInput.requestEnvelope.request.intent.slots.patternType.value ? handlerInput.requestEnvelope.request.intent.slots.patternType.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            steps = handlerInput.requestEnvelope.request.intent.slots.steps.value,
            message;

        if (patternType) {
            if (!steps && (patternType === 'wizard' || patternType === 'multilevel master detail')) {
                sessionAttributes.notify = {
                    message: 'Specify the number of steps the pattern require.',
                    messageType: 'warning'
                };
                return handlerInput.responseBuilder
                    .speak('How many steps does the pattern require?')
                    .addElicitSlotDirective('steps')
                    .getResponse();
            } else {
                message = 'Add pattern ' + patternType;

                if (steps) {
                    message += ' with ' + steps + ' step.';
                }

                sessionAttributes.notify = {
                    message: message,
                    messageType: 'success'
                };
                sessionAttributes.advanced = {
                    operation: 'add-pattern',
                    options: {
                        patternType: patternType,
                        steps: steps
                    }
                }
                return handlerInput.responseBuilder
                    .speak('done')
                    .withShouldEndSession(false)
                    .getResponse();
            }
        } else {
            sessionAttributes.notify = {
                message: 'Specify the type of the pattern you want to add.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.AddPatternModelIntentHandler = AddPatternModelIntentHandler;
