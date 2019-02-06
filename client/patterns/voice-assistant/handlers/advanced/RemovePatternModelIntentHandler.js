const RemovePatternModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RemovePatternModelIntent'
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
          .speak('done')
          .withShouldEndSession(false)
          .getResponse();
    }
};

exports.RemovePatternModelIntentHandler = RemovePatternModelIntentHandler;
