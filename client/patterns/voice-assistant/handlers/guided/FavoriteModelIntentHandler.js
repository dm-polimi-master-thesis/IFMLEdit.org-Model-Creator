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
                steps: [{step: 'Favorite Content Management Pattern', svg: './svg/okay-animated.svg'}],
                guided: true
            };
        } else if (answer === 'deny') {
          sessionAttributes.notify = {
              steps: [{step: 'Favorite Content Management Pattern', svg: './svg/delete-animated.svg'}],
              guided: true
          };
        }

        switch (sessionAttributes.model.type) {
          case 'e-commerce':
              sessionAttributes.notify.message = 'Do you want a payment procedure?';
              sessionAttributes.nextStep = 'wizard-pattern-handler';
              return handlerInput.responseBuilder
                  .speak('The payment procedure is managed through a wizard pattern that progressively require information to the customer. It\'s good for you or do you want to create your personal procedure independently?')
                  .addElicitSlotDirective('wizardPolicy')
                  .getResponse();
          case 'blog':
              sessionAttributes.notify.message = 'Do you want to allow comments to the articles?';
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
