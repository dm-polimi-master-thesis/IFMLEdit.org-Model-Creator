const ZoomModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ZoomModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.zoom.value
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            zoom = handlerInput.requestEnvelope.request.intent.slots.zoom.resolutions.resolutionsPerAuthority[0].values[0].value.name,
            times = handlerInput.requestEnvelope.request.intent.slots.times.value || 1,
            message;

        if (times) {
          times = times >= 1 ? times : 1;
          message = zoom + ' x' + times;
        } else {
          message = zoom;
        }

        sessionAttributes.notify = {
            message: message,
            messageType: 'success'
        };

        sessionAttributes.advanced = {
            operation: 'zoom',
            options: {
                zoom: zoom,
                times: times
            }
        }

        return handlerInput.responseBuilder
            .speak('done')
            .withShouldEndSession(false)
            .getResponse();
    }
};

exports.ZoomModelIntentHandler = ZoomModelIntentHandler;
