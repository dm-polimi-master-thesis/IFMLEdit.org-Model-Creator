var Alexa = require('ask-sdk-core'),
    _ = require('lodash');

const cleanAttributesInterceptor = {
  process(handlerInput) {
      return new Promise((resolve, reject) => {
          var attributes = handlerInput.attributesManager.getSessionAttributes();
          if (attributes.demo) {
              attributes.demo = undefined;
          }
          if(attributes.notify) {
              attributes.notify = undefined;
          }

          handlerInput.attributesManager.setSessionAttributes(attributes);
          resolve();
      });
  }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        var speechText = 'Welcome to IFML model creator!',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'Welcome!',
            messageType: 'success'
        };

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const DemoModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'DemoModelIntent';
    },
    handle(handlerInput) {
        var speechText = 'With great pleasure! Visualize the model in IFMLEdit!',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'Demo!',
            messageType: 'success'
        };

        sessionAttributes.demo = {
            template: 'demo'
        }

        sessionAttributes.state = 'IN_PROGRESS'

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CreateModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && !handlerInput.requestEnvelope.request.intent.slots.process.value;
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'Let\'s start!',
            messageType: 'success'
        };

        return handlerInput.responseBuilder
            .addDelegateDirective()
            .getResponse();
    }
};

const GuidedModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.process.value
            && handlerInput.requestEnvelope.request.intent.slots.process.value === 'guided'
            && !handlerInput.requestEnvelope.request.intent.slots.purpose.value;
    },
    handle(handlerInput) {
        var speechText = 'What is the primary purpose of the application? Show and sell products, share contents or ask people to collaborate on some projects?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'What is the primary purpose?',
            messageType: 'success'
        };

        sessionAttributes.model = {
            type: '',
            pattern: [],
        };

        return handlerInput.responseBuilder
            .addDelegateDirective()
            .getResponse();
    }
};

const EcommerceModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.purpose.value
            && handlerInput.requestEnvelope.request.intent.slots.purpose.value === 'show and sell products'
            && !handlerInput.attributesManager.getSessionAttributes().nextStep;
    },
    handle(handlerInput) {
        var speechText = 'The products that you intend to sell are homogeneous or require to be divided into categories and sub-categories?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'E-commerce',
            messageType: 'success'
        };

        sessionAttributes.model.type = 'e-commerce';

        sessionAttributes.nextStep = 'master-details-pattern-handler';

        return handlerInput.responseBuilder
            .speak(speechText)
            .addElicitSlotDirective('masterDetailsPattern')
            .getResponse();
    }
};


const MasterDetailsModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.attributesManager.getSessionAttributes().nextStep
            && handlerInput.attributesManager.getSessionAttributes().nextStep === 'master-details-pattern-handler';
    },
    handle(handlerInput) {
        var speechText = 'Do you want to allow or deny reviews of the products?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        if (_.includes(handlerInput.requestEnvelope.request.intent.slots.masterDetailsPattern.value,'categories')) {
            sessionAttributes.model.pattern.push('multilevel-master-details','restricted-search');
            sessionAttributes.notify = {
              message: 'Multilevel Master Details',
              messageType: 'success'
            };
        } else {
            sessionAttributes.model.pattern.push('master-details','basic-search');
            sessionAttributes.notify = {
              message: 'Master Details',
              messageType: 'success'
            };
        }

        sessionAttributes.nextStep = 'comment-content-manager-pattern-handler';

        return handlerInput.responseBuilder
            .speak(speechText)
            .addElicitSlotDirective('commentPolicy')
            .getResponse();
    }
};

const CommentsContentManagementPatternModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.attributesManager.getSessionAttributes().nextStep
            && handlerInput.attributesManager.getSessionAttributes().nextStep === 'comment-content-manager-pattern-handler';
    },
    handle(handlerInput) {
        var speechText = 'It would be nice if users could save their favorite products on a wish list. What do you think about it?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            answer = handlerInput.requestEnvelope.request.intent.slots.commentPolicy.value;

        if (answer === 'allow' || answer === 'permit' || answer === 'yes') {
            sessionAttributes.model.pattern.push('comment-content-management-pattern');
            sessionAttributes.notify = {
              message: 'Allow comments!',
              messageType: 'success'
            };
        } else if (answer === 'deny' || answer === 'cannot' || answer === 'no') {
            sessionAttributes.notify = {
              message: 'Deny comments!',
              messageType: 'success'
            };
        }

        sessionAttributes.nextStep = 'favorite-content-manager-pattern-handler';

        return handlerInput.responseBuilder
            .speak(speechText)
            .addElicitSlotDirective('favoritePolicy')
            .getResponse();
    }
};

const FavoriteContentManagementPatternModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.attributesManager.getSessionAttributes().nextStep
            && handlerInput.attributesManager.getSessionAttributes().nextStep === 'favorite-content-manager-pattern-handler';
    },
    handle(handlerInput) {
        var speechText = 'The payment procedure is managed through a wizard pattern that progressively require information to the customer. It\'s good for you or do you want to create your personal procedure independently?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            answer = handlerInput.requestEnvelope.request.intent.slots.favoritePolicy.value;

        if (answer === 'allow' || answer === 'good idea' || answer === 'great idea' || answer === 'okay' || answer === 'yes') {
            sessionAttributes.model.pattern.push('favorite-content-management-pattern');
            sessionAttributes.notify = {
              message: 'Allow wish list!',
              messageType: 'success'
            };
        } else if (answer === 'deny' || answer === 'bad idea' || answer === 'no') {
            sessionAttributes.notify = {
              message: 'Deny wish list!',
              messageType: 'success'
            };
        }

        sessionAttributes.nextStep = 'wizard-pattern-handler';

        return handlerInput.responseBuilder
            .speak(speechText)
            .addElicitSlotDirective('wizardPolicy')
            .getResponse();
    }
};

const WizardPatternModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.attributesManager.getSessionAttributes().nextStep
            && handlerInput.attributesManager.getSessionAttributes().nextStep === 'wizard-pattern-handler';
    },
    handle(handlerInput) {
        var speechText = 'Great! I think we have finished. Visualize the result in IFMLEdit!',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            answer = handlerInput.requestEnvelope.request.intent.slots.wizardPolicy.value;

        if (answer === 'default' || answer === 'good' || answer === 'great' || answer === 'okay' || answer === 'yes') {
            sessionAttributes.model.pattern.push('wizard-pattern');
            sessionAttributes.notify = {
              message: 'Default wizard payment procedure!',
              messageType: 'success'
            };
        } else if (answer === 'personal' || answer === 'my' || answer === 'no') {
            sessionAttributes.notify = {
              message: 'Personal wizard payment procedure!',
              messageType: 'success'
            };
        }

        handlerInput.requestEnvelope.request.dialogState = 'COMPLETED';

        sessionAttributes.state = 'COMPLETED';

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        var speechText = 'You can say hello to me!',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
          message: 'Help!',
          messageType: 'warning'
        };

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        var speechText = 'Goodbye!',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
          message: 'Goodbye!',
          messageType: 'success'
        };

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    },
};

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

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {

        var speechText = 'Sorry, I can\'t understand the command. Please say again.',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
          message: 'Error!',
          messageType: 'danger'
        };

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        DemoModelIntentHandler,
        CreateModelIntentHandler,
        GuidedModelIntentHandler,
        EcommerceModelIntentHandler,
        MasterDetailsModelIntentHandler,
        CommentsContentManagementPatternModelIntentHandler,
        FavoriteContentManagementPatternModelIntentHandler,
        WizardPatternModelIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addRequestInterceptors(cleanAttributesInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();
