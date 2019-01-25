const FavoriteModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.attributesManager.getSessionAttributes().nextStep
            && handlerInput.attributesManager.getSessionAttributes().nextStep === 'favorite-content-management-pattern-handler';
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            answer = handlerInput.requestEnvelope.request.intent.slots.favoritePolicy.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        if (answer === 'allow') {
            sessionAttributes.model.pattern.push('favorite-content-management-pattern');
            sessionAttributes.notify = {
              message: 'Allow wish list!',
              messageType: 'success'
            };
        } else if (answer === 'deny') {
            sessionAttributes.notify = {
              message: 'Deny wish list!',
              messageType: 'success'
            };
        }

        switch (sessionAttributes.model.type) {
          case 'e-commerce':
              sessionAttributes.nextStep = 'wizard-pattern-handler';
              return handlerInput.responseBuilder
                  .speak('The payment procedure is managed through a wizard pattern that progressively require information to the customer. It\'s good for you or do you want to create your personal procedure independently?')
                  .addElicitSlotDirective('wizardPolicy')
                  .getResponse();
          case 'blog':
              sessionAttributes.nextStep = 'comment-content-management-pattern-handler';
              return handlerInput.responseBuilder
                  .speak('Do you want to allow or deny comments to the articles?')
                  .addElicitSlotDirective('commentPolicy')
                  .getResponse();
          default:
              return handlerInput.responseBuilder
                  .speak('Unexpected behaviour!')
                  .getResponse();
        }
    }
};

exports.FavoriteModelIntentHandler = FavoriteModelIntentHandler;
