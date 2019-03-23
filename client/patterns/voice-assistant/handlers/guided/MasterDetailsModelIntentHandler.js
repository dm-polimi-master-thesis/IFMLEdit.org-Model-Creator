const MasterDetailsModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.attributesManager.getSessionAttributes().nextStep
            && handlerInput.attributesManager.getSessionAttributes().nextStep === 'master-details-pattern-handler';
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            answer = handlerInput.requestEnvelope.request.intent.slots.masterDetailsPattern.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        if (answer === 'categories') {
            sessionAttributes.model.pattern.push('multilevel-master-details','restricted-search');
            sessionAttributes.notify = {
                steps: [{step: 'Multilevel Master Detail', svg: './svg/okay-animated.svg'},{step: 'Restricted Search', svg: './svg/okay-animated.svg'}],
                guided: true
            };
        } else if (answer === 'homogeneous') {
            sessionAttributes.model.pattern.push('master-details','basic-search');
            sessionAttributes.notify = {
                steps: [{step: 'Master Detail', svg: './svg/okay-animated.svg'},{step: 'Basic Search', svg: './svg/okay-animated.svg'}],
                guided: true
            };
        }

        switch (sessionAttributes.model.type) {
          case 'e-commerce':
              sessionAttributes.notify.message = 'Do you want to allow reviews of the products?';
              sessionAttributes.nextStep = 'comment-content-management-pattern-handler';
              return handlerInput.responseBuilder
                  .speak('Do you want to allow or deny reviews of the products?')
                  .addElicitSlotDirective('commentPolicy')
                  .getResponse();
          case 'crowdsourcing':
              sessionAttributes.notify.message = 'Great! I think we have finished';
              sessionAttributes.notify.end = true;
              handlerInput.requestEnvelope.request.dialogState = 'COMPLETED';
              sessionAttributes.state = 'COMPLETED';
              sessionAttributes.nextStep = undefined;
              return handlerInput.responseBuilder
                  .speak('Great! I think we have finished. Visualize the result in IFMLEdit!')
                  .withShouldEndSession(false)
                  .getResponse();
          case 'blog':
              sessionAttributes.notify.message = 'Are you interested in creating a sort of community?';
              sessionAttributes.nextStep = 'personal-pages-content-management-pattern-handler';
              return handlerInput.responseBuilder
                  .speak('Are you interested in creating a sort of community where user can publish articles or users can only visualize and execute operations on published articles?')
                  .addElicitSlotDirective('personalPagesPolicy')
                  .getResponse();
          default:
              return handlerInput.responseBuilder
                  .speak('Unexpected behaviour!')
                  .getResponse();
        }
    }
};

exports.MasterDetailsModelIntentHandler = MasterDetailsModelIntentHandler;
