const CommentsModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.attributesManager.getSessionAttributes().nextStep
            && handlerInput.attributesManager.getSessionAttributes().nextStep === 'comment-content-management-pattern-handler';
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            answer = handlerInput.requestEnvelope.request.intent.slots.commentPolicy.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        if (answer === 'allow') {
            sessionAttributes.model.pattern.push('comment-content-management-pattern');
            sessionAttributes.notify = {
                steps: [{step: 'Comment Content Management Pattern', svg: './svg/okay-animated.svg'}],
                guided: true
            };
        } else if (answer === 'deny') {
          sessionAttributes.notify = {
              steps: [{step: 'Comment Content Management Pattern', svg: './svg/delete-animated.svg'}],
              guided: true
          };
        }

        switch (sessionAttributes.model.type) {
          case 'e-commerce':
              sessionAttributes.notify.message = 'Do you want to implement wish lists?';
              sessionAttributes.nextStep = 'favorite-content-management-pattern-handler';
              return handlerInput.responseBuilder
                  .speak('It would be nice if users could save their favorite products on a wish list. What do you think about it?')
                  .addElicitSlotDirective('favoritePolicy')
                  .getResponse();
          case 'blog':
              handlerInput.requestEnvelope.request.dialogState = 'COMPLETED';
              sessionAttributes.notify.message = 'Great! I think we have finished';
              sessionAttributes.notify.end = true;
              sessionAttributes.state = 'COMPLETED';
              sessionAttributes.nextStep = undefined;
              return handlerInput.responseBuilder
                  .speak('Great! I think we have finished. Visualize the result in IFMLEdit!')
                  .withShouldEndSession(false)
                  .getResponse();
          case 'social-network':
              sessionAttributes.notify.message = 'What about the likes functionality?';
              sessionAttributes.nextStep = 'like-content-management-pattern-handler';
              return handlerInput.responseBuilder
                  .speak('It would be nice if users could express consent to a post through a like functionality. What do you think about it?')
                  .addElicitSlotDirective('likePolicy')
                  .getResponse();
          default:
              return handlerInput.responseBuilder
                  .speak('Unexpected behaviour!')
                  .getResponse();
        }
    }
};

exports.CommentsModelIntentHandler = CommentsModelIntentHandler;
