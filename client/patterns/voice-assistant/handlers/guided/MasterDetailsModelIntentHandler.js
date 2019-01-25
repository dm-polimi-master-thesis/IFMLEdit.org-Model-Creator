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
              message: 'Multilevel Master Details',
              messageType: 'success'
            };
        } else if (answer === 'homogeneous') {
            sessionAttributes.model.pattern.push('master-details','basic-search');
            sessionAttributes.notify = {
              message: 'Master Details',
              messageType: 'success'
            };
        }

        switch (sessionAttributes.model.type) {
          case 'e-commerce':
              sessionAttributes.nextStep = 'comment-content-management-pattern-handler';
              return handlerInput.responseBuilder
                  .speak('Do you want to allow or deny reviews of the products?')
                  .addElicitSlotDirective('commentPolicy')
                  .getResponse();
          case 'crowdsourcing':
              handlerInput.requestEnvelope.request.dialogState = 'COMPLETED';
              sessionAttributes.state = 'COMPLETED';
              sessionAttributes.nextStep = undefined;
              return handlerInput.responseBuilder
                  .speak('Great! I think we have finished. Visualize the result in IFMLEdit!')
                  .getResponse();
          case 'blog':
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
