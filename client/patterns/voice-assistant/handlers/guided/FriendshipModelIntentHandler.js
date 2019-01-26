const FriendshipModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.attributesManager.getSessionAttributes().nextStep
            && handlerInput.attributesManager.getSessionAttributes().nextStep === 'friends-content-management-pattern-handler';
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            answer = handlerInput.requestEnvelope.request.intent.slots.friendship.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        if (answer === 'allow') {
            sessionAttributes.model.pattern.push('friends-content-management-pattern','basic-search');
            sessionAttributes.notify = {
              message: 'Allow Friendship!',
              messageType: 'success'
            };
        } else if (answer === 'deny') {
            sessionAttributes.notify = {
              message: 'Deny Friendship!',
              messageType: 'success'
            };
        }

        switch (sessionAttributes.model.type) {
          case 'social-network':
              handlerInput.requestEnvelope.request.dialogState = 'COMPLETED';
              sessionAttributes.state = 'COMPLETED';
              sessionAttributes.nextStep = undefined;

              return handlerInput.responseBuilder
                  .speak('Great! I think we have finished. Visualize the result in IFMLEdit!')
                  .withShouldEndSession(false)
                  .getResponse();
          default:
              return handlerInput.responseBuilder
                  .speak('Unexpected behaviour!')
                  .getResponse();
        }
    }
};

exports.FriendshipModelIntentHandler = FriendshipModelIntentHandler;
