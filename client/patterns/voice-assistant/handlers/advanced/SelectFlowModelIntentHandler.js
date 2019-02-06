const SelectFlowModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SelectFlowModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            sourceName = handlerInput.requestEnvelope.request.intent.slots.sourceName.value,
            targetName = handlerInput.requestEnvelope.request.intent.slots.targetName.value,
            sourceType = handlerInput.requestEnvelope.request.intent.slots.sourceType.value ? handlerInput.requestEnvelope.request.intent.slots.sourceType.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            targetType = handlerInput.requestEnvelope.request.intent.slots.targetType.value ? handlerInput.requestEnvelope.request.intent.slots.targetType.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            flowType = handlerInput.requestEnvelope.request.intent.slots.flowType.value ? handlerInput.requestEnvelope.request.intent.slots.flowType.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            message;

        if (sourceName && targetName && sourceType && targetType && flowType) {
            message = 'Selected from ' + sourceName + ' ' + sourceType + ' to ' + targetName + ' ' + targetType + ' ' + flowType;

            sessionAttributes.notify = {
                message: message,
                messageType: 'success'
            };
            sessionAttributes.advanced = {
                operation: 'select-flow',
                options: {
                    sourceName: sourceName,
                    sourceType: sourceType,
                    targetName: targetName,
                    targetType: targetType,
                    flowType: flowType
                }
            }
            return handlerInput.responseBuilder
                .speak('done')
                .withShouldEndSession(false)
                .getResponse();
        } else {
            sessionAttributes.notify = {
                message: 'Specify all the information relative to the flow you want to select.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.SelectFlowModelIntentHandler = SelectFlowModelIntentHandler;
