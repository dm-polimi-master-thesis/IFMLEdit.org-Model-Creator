const PersonalPagesModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.attributesManager.getSessionAttributes().nextStep
            && handlerInput.attributesManager.getSessionAttributes().nextStep === 'personal-pages-content-management-pattern-handler';
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            answer = handlerInput.requestEnvelope.request.intent.slots.personalPagesPolicy.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        if (answer === 'publish') {
            sessionAttributes.model.pattern.push('personal-pages-content-management-pattern');
            sessionAttributes.notify = {
                steps: [{step: 'Personal Pages Content Management Pattern', svg: './svg/okay-animated.svg'}],
                guided: true
            };
        } else if (answer === 'visualize') {
          sessionAttributes.notify = {
              steps: [{step: 'Personal Pages Content Management Pattern', svg: './svg/delete-animated.svg'}],
              guided: true
          };
        }

        switch (sessionAttributes.model.type) {
          case 'blog':
              sessionAttributes.notify.message = 'Users can save articles on a favorite list?';
              sessionAttributes.nextStep = 'favorite-content-management-pattern-handler';
              return handlerInput.responseBuilder
                  .speak('It would be nice if users could save the most beautiful articles on a favorite list. What do you think about it?')
                  .addElicitSlotDirective('favoritePolicy')
                  .getResponse();
          default:
              return handlerInput.responseBuilder
                  .speak('Unexpected behaviour!')
                  .getResponse();
        }
    }
};

exports.PersonalPagesModelIntentHandler = PersonalPagesModelIntentHandler;
