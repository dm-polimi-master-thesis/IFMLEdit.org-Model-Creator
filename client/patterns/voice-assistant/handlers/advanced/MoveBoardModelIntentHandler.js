const MoveBoardModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'MoveBoardModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.move.value
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            move = handlerInput.requestEnvelope.request.intent.slots.move.resolutions.resolutionsPerAuthority[0].values[0].value.name,
            times = handlerInput.requestEnvelope.request.intent.slots.times.value || 1,
            message;

        if (times) {
          times = times >= 1 ? times : 1;
          message = move + ' x' + times;
        } else {
          message = move;
        }

        sessionAttributes.notify = {
            message: message,
            messageType: 'success',
            advanced: true
        };

        sessionAttributes.advanced = {
            operation: 'move-board',
            options: {
                move: move,
                times: times
            }
        }

        return handlerInput.responseBuilder
            .speak('done')
            .withShouldEndSession(false)
            .getResponse();
    }
};

exports.MoveBoardModelIntentHandler = MoveBoardModelIntentHandler;
