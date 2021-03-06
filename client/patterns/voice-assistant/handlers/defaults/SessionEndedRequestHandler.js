const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {

        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
          message: 'Session Ended!',
          messageType: 'success'
        };

        sessionAttributes.welcome = false;
        sessionAttributes.goodbye = true;

        return handlerInput.responseBuilder.getResponse();
    },
};

exports.SessionEndedRequestHandler = SessionEndedRequestHandler;
