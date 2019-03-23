const LikesModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.attributesManager.getSessionAttributes().nextStep
            && handlerInput.attributesManager.getSessionAttributes().nextStep === 'like-content-management-pattern-handler';
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            answer = handlerInput.requestEnvelope.request.intent.slots.likePolicy.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        if (answer === 'allow') {
            sessionAttributes.model.pattern.push('like-content-management-pattern');
            sessionAttributes.notify = {
                steps: [{step: 'Likes Content Management Pattern', svg: './svg/okay-animated.svg'}],
                guided: true
            };
        } else if (answer === 'deny') {
          sessionAttributes.notify = {
              steps: [{step: 'Likes Content Management Pattern', svg: './svg/delete-animated.svg'}],
              guided: true
          };
        }

        switch (sessionAttributes.model.type) {
          case 'social-network':
              sessionAttributes.notify.message = 'Users can establish relationships?';
              sessionAttributes.nextStep = 'friends-content-management-pattern-handler';
              return handlerInput.responseBuilder
                  .speak('In traditional social networks users can establish relationships. Is this your case?')
                  .addElicitSlotDirective('friendship')
                  .getResponse();
          default:
              return handlerInput.responseBuilder
                  .speak('Unexpected behaviour!')
                  .getResponse();
        }
    }
};

exports.LikesModelIntentHandler = LikesModelIntentHandler;
