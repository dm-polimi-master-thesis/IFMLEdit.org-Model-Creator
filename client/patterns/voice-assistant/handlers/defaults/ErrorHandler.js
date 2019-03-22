const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {

        var speechText = 'Sorry, I can\'t understand the command. Please say again.',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        /*sessionAttributes.notify = {
          message: 'Error!',
          messageType: 'danger'
        };*/

        sessionAttributes.welcome = false;
        sessionAttributes.goodbye = true;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    },
};

exports.ErrorHandler = ErrorHandler;
