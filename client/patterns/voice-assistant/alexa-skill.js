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
            && handlerInput.requestEnvelope.request.intent.slots.process.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'guided'
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
            && handlerInput.requestEnvelope.request.intent.slots.purpose.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'show and sell products'
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

const CrowdsourcingModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.purpose.value
            && handlerInput.requestEnvelope.request.intent.slots.purpose.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'collaborate'
            && !handlerInput.attributesManager.getSessionAttributes().nextStep;
    },
    handle(handlerInput) {
        var speechText = 'Are users limited to perform tasks or some users can publish tasks?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'Crowdsourcing',
            messageType: 'success'
        };

        sessionAttributes.model.type = 'crowdsourcing';
        sessionAttributes.nextStep = 'crowd-policy-handler';

        return handlerInput.responseBuilder
            .speak(speechText)
            .addElicitSlotDirective('crowdPolicy')
            .getResponse();
    }
};

const ShareContentModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.purpose.value
            && handlerInput.requestEnvelope.request.intent.slots.purpose.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'share'
            && !handlerInput.attributesManager.getSessionAttributes().nextStep;
    },
    handle(handlerInput) {
        var speechText = 'What type of content users can share, posts or articles?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'Share Contents',
            messageType: 'success'
        };

        return handlerInput.responseBuilder
            .speak(speechText)
            .addElicitSlotDirective('sharing')
            .getResponse();
    }
}

const BlogModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.purpose.value
            && handlerInput.requestEnvelope.request.intent.slots.purpose.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'share'
            && handlerInput.requestEnvelope.request.intent.slots.sharing.value
            && handlerInput.requestEnvelope.request.intent.slots.sharing.value === 'articles'
            && !handlerInput.attributesManager.getSessionAttributes().nextStep;
    },
    handle(handlerInput) {
        var speechText = 'Are the articles relative to the same topic or they can divided in categories and sub-categories?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'Blog',
            messageType: 'success'
        };

        sessionAttributes.model.type = 'blog';
        sessionAttributes.nextStep = 'master-details-pattern-handler';

        return handlerInput.responseBuilder
            .speak(speechText)
            .addElicitSlotDirective('masterDetailsPattern')
            .getResponse();
    }
}

const SocialNetworkModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.requestEnvelope.request.intent.slots.purpose.value
            && handlerInput.requestEnvelope.request.intent.slots.purpose.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'share'
            && handlerInput.requestEnvelope.request.intent.slots.sharing.value
            && handlerInput.requestEnvelope.request.intent.slots.sharing.resolutions.resolutionsPerAuthority[0].values[0].value.name === 'posts'
            && !handlerInput.attributesManager.getSessionAttributes().nextStep;
    },
    handle(handlerInput) {
        var speechText = 'Can user comment posts or they can only visualize posts?',
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.notify = {
            message: 'Social Network',
            messageType: 'success'
        };

        sessionAttributes.model.type = 'social-network';
        sessionAttributes.nextStep = 'comment-content-management-pattern-handler';

        return handlerInput.responseBuilder
            .speak(speechText)
            .addElicitSlotDirective('commentPolicy')
            .getResponse();
    }
}

const CrowdPolicyIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.attributesManager.getSessionAttributes().nextStep
            && handlerInput.attributesManager.getSessionAttributes().nextStep === 'crowd-policy-handler';
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            answer = handlerInput.requestEnvelope.request.intent.slots.crowdPolicy.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        if (answer === 'publish') {
            sessionAttributes.model.pattern.push('master-policy');
            sessionAttributes.notify = {
              message: 'Master Policy',
              messageType: 'success'
            };
        } else if (answer === 'perform') {
            sessionAttributes.model.pattern.push('worker-policy');
            sessionAttributes.notify = {
              message: 'Worker Policy',
              messageType: 'success'
            };
        }

        switch (sessionAttributes.model.type) {
          case 'crowdsourcing':
              sessionAttributes.nextStep = 'master-details-pattern-handler';

              return handlerInput.responseBuilder
                  .speak('Are tasks relative to the same topic or they can be divided in categories and subcategories?')
                  .addElicitSlotDirective('masterDetailsPattern')
                  .getResponse();
          default:
              return handlerInput.responseBuilder
                  .speak('Unexpected behaviour!')
                  .getResponse();
        }
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

const CommentsContentManagementPatternModelIntentHandler = {
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
              message: 'Allow comments!',
              messageType: 'success'
            };
        } else if (answer === 'deny') {
            sessionAttributes.notify = {
              message: 'Deny comments!',
              messageType: 'success'
            };
        }

        switch (sessionAttributes.model.type) {
          case 'e-commerce':
              sessionAttributes.nextStep = 'favorite-content-management-pattern-handler';
              return handlerInput.responseBuilder
                  .speak('It would be nice if users could save their favorite products on a wish list. What do you think about it?')
                  .addElicitSlotDirective('favoritePolicy')
                  .getResponse();
          case 'blog':
              handlerInput.requestEnvelope.request.dialogState = 'COMPLETED';
              sessionAttributes.state = 'COMPLETED';
              sessionAttributes.nextStep = undefined;
              return handlerInput.responseBuilder
                  .speak('Great! I think we have finished. Visualize the result in IFMLEdit!')
                  .getResponse();
          case 'social':
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

const PersonalPagesContentManagementPatternModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.attributesManager.getSessionAttributes().nextStep
            && handlerInput.attributesManager.getSessionAttributes().nextStep === 'personal-pages-content-management-pattern-handler';
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            answer = handlerInput.requestEnvelope.request.intent.slots.personalPagesPolicy.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        if (answer === 'allow') {
            sessionAttributes.model.pattern.push('personal-pages-content-management-pattern');
            sessionAttributes.notify = {
              message: 'Allow publishing!',
              messageType: 'success'
            };
        } else if (answer === 'deny') {
            sessionAttributes.notify = {
              message: 'Deny publishing!',
              messageType: 'success'
            };
        }

        switch (sessionAttributes.model.type) {
          case 'blog':
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

const FavoriteContentManagementPatternModelIntentHandler = {
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

const LikeContentManagementPatternModelIntentHandler = {
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
              message: 'Allow Likes!',
              messageType: 'success'
            };
        } else if (answer === 'deny') {
            sessionAttributes.notify = {
              message: 'Deny Likes!',
              messageType: 'success'
            };
        }

        switch (sessionAttributes.model.type) {
          case 'social-network':
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

const FriendsContentManagementPatternModelIntentHandler = {
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
                  .getResponse();
          default:
              return handlerInput.responseBuilder
                  .speak('Unexpected behaviour!')
                  .getResponse();
        }
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
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            answer = handlerInput.requestEnvelope.request.intent.slots.wizardPolicy.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        if (answer === 'default') {
            sessionAttributes.model.pattern.push('wizard-pattern');
            sessionAttributes.notify = {
              message: 'Default wizard payment procedure!',
              messageType: 'success'
            };
        } else if (answer === 'personal') {
            sessionAttributes.notify = {
              message: 'Personal wizard payment procedure!',
              messageType: 'success'
            };
        }

        switch (sessionAttributes.model.type) {
          case 'e-commerce':
              handlerInput.requestEnvelope.request.dialogState = 'COMPLETED';
              sessionAttributes.state = 'COMPLETED';
              sessionAttributes.nextStep = undefined;
              return handlerInput.responseBuilder
                  .speak('Great! I think we have finished. Visualize the result in IFMLEdit!')
                  .getResponse();
          default:
              return handlerInput.responseBuilder
                  .speak('Unexpected behaviour!')
                  .getResponse();
        }
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
        ShareContentModelIntentHandler,
        BlogModelIntentHandler,
        SocialNetworkModelIntentHandler,
        CrowdsourcingModelIntentHandler,
        CrowdPolicyIntentHandler,
        MasterDetailsModelIntentHandler,
        PersonalPagesContentManagementPatternModelIntentHandler,
        CommentsContentManagementPatternModelIntentHandler,
        FavoriteContentManagementPatternModelIntentHandler,
        LikeContentManagementPatternModelIntentHandler,
        FriendsContentManagementPatternModelIntentHandler,
        WizardPatternModelIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addRequestInterceptors(cleanAttributesInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();
