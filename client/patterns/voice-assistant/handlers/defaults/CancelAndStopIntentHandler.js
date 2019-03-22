const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        var speechText = 'Goodbye!',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        /*sessionAttributes.notify = {
          message: 'Goodbye!',
          messageType: 'success'
        };*/

        sessionAttributes.welcome = false;
        sessionAttributes.goodbye = true;

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    },
};

exports.CancelAndStopIntentHandler = CancelAndStopIntentHandler;
