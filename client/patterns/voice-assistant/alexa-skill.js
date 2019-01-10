var Alexa = require('ask-sdk-core'),
    _ = require('lodash'),
    cleanAttributesInterceptor = require('./interceptors/cleanAttributesInterceptor.js').cleanAttributesInterceptor,
    ErrorHandler = require('./handlers/ErrorHandler.js').ErrorHandler;

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        BlogModelIntentHandler = require('./handlers/BlogModelIntentHandler.js').BlogModelIntentHandler,
        CancelAndStopIntentHandler = require('./handlers/CancelAndStopIntentHandler.js').CancelAndStopIntentHandler,
        CommentsModelIntentHandler = require('./handlers/CommentsModelIntentHandler.js').CommentsModelIntentHandler,
        CreateModelIntentHandler = require('./handlers/CreateModelIntentHandler.js').CreateModelIntentHandler,
        CrowdsourcingModelIntentHandler = require('./handlers/CrowdsourcingModelIntentHandler.js').CrowdsourcingModelIntentHandler,
        CrowdPolicyModelIntentHandler = require('./handlers/CrowdPolicyModelIntentHandler.js').CrowdPolicyModelIntentHandler,
        DemoModelIntentHandler = require('./handlers/DemoModelIntentHandler.js').DemoModelIntentHandler,
        EcommerceModelIntentHandler = require('./handlers/EcommerceModelIntentHandler.js').EcommerceModelIntentHandler,
        FavoriteModelIntentHandler = require('./handlers/FavoriteModelIntentHandler.js').FavoriteModelIntentHandler,
        FriendshipModelIntentHandler = require('./handlers/FriendshipModelIntentHandler.js').FriendshipModelIntentHandler,
        GuidedModelIntentHandler = require('./handlers/GuidedModelIntentHandler.js').GuidedModelIntentHandler,
        HelpIntentHandler = require('./handlers/HelpIntentHandler.js').HelpIntentHandler,
        LaunchRequestHandler = require('./handlers/LaunchRequestHandler.js').LaunchRequestHandler,
        LikesModelIntentHandler = require('./handlers/LikesModelIntentHandler.js').LikesModelIntentHandler,
        MasterDetailsModelIntentHandler = require('./handlers/MasterDetailsModelIntentHandler.js').MasterDetailsModelIntentHandler,
        PersonalPagesModelIntentHandler = require('./handlers/PersonalPagesModelIntentHandler.js').PersonalPagesModelIntentHandler,
        SessionEndedRequestHandler = require('./handlers/SessionEndedRequestHandler.js').SessionEndedRequestHandler,
        ShareContentModelIntentHandler = require('./handlers/ShareContentModelIntentHandler.js').ShareContentModelIntentHandler,
        SocialNetworkModelIntentHandler = require('./handlers/SocialNetworkModelIntentHandler.js').SocialNetworkModelIntentHandler,
        WizardModelIntentHandler = require('./handlers/WizardModelIntentHandler.js').WizardModelIntentHandler
    )
    .addRequestInterceptors(cleanAttributesInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();
