var Alexa = require('ask-sdk-core'),
    _ = require('lodash'),
    cleanAttributesInterceptor = require('./interceptors/cleanAttributesInterceptor.js').cleanAttributesInterceptor,
    ErrorHandler = require('./handlers/defaults/ErrorHandler.js').ErrorHandler;

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        AdvancedModelIntentHandler = require('./handlers/advanced/AdvancedModelIntentHandler.js').AdvancedModelIntentHandler,
        BlogModelIntentHandler = require('./handlers/guided/BlogModelIntentHandler.js').BlogModelIntentHandler,
        CancelAndStopIntentHandler = require('./handlers/defaults/CancelAndStopIntentHandler.js').CancelAndStopIntentHandler,
        ConnectElementsModelIntentHandler = require('./handlers/advanced/ConnectElementsModelIntentHandler.js').ConnectElementsModelIntentHandler,
        CommentsModelIntentHandler = require('./handlers/guided/CommentsModelIntentHandler.js').CommentsModelIntentHandler,
        CreateModelIntentHandler = require('./handlers/invocation/CreateModelIntentHandler.js').CreateModelIntentHandler,
        CrowdsourcingModelIntentHandler = require('./handlers/guided/CrowdsourcingModelIntentHandler.js').CrowdsourcingModelIntentHandler,
        CrowdPolicyModelIntentHandler = require('./handlers/guided/CrowdPolicyModelIntentHandler.js').CrowdPolicyModelIntentHandler,
        DeleteElementModelIntentHandler = require('./handlers/advanced/DeleteElementModelIntentHandler.js').DeleteElementModelIntentHandler,
        DemoModelIntentHandler = require('./handlers/guided/DemoModelIntentHandler.js').DemoModelIntentHandler,
        DragDropElementModelIntentHandler = require('./handlers/advanced/DragDropElementModelIntentHandler.js').DragDropElementModelIntentHandler,
        EcommerceModelIntentHandler = require('./handlers/guided/EcommerceModelIntentHandler.js').EcommerceModelIntentHandler,
        FavoriteModelIntentHandler = require('./handlers/guided/FavoriteModelIntentHandler.js').FavoriteModelIntentHandler,
        FriendshipModelIntentHandler = require('./handlers/guided/FriendshipModelIntentHandler.js').FriendshipModelIntentHandler,
        GenerateElementModelIntentHandler = require('./handlers/advanced/GenerateElementModelIntentHandler').GenerateElementModelIntentHandler,
        GenerateViewContainerModelIntentHandler = require('./handlers/advanced/GenerateViewContainerModelIntentHandler').GenerateViewContainerModelIntentHandler,
        GuidedModelIntentHandler = require('./handlers/guided/GuidedModelIntentHandler.js').GuidedModelIntentHandler,
        HelpIntentHandler = require('./handlers/defaults/HelpIntentHandler.js').HelpIntentHandler,
        InsertElementModelIntentHandler = require('./handlers/advanced/InsertElementModelIntentHandler.js').InsertElementModelIntentHandler,
        InsertEventModelIntentHandler = require('./handlers/advanced/InsertEventModelIntentHandler.js').InsertEventModelIntentHandler,
        LaunchRequestHandler = require('./handlers/invocation/LaunchRequestHandler.js').LaunchRequestHandler,
        LikesModelIntentHandler = require('./handlers/guided/LikesModelIntentHandler.js').LikesModelIntentHandler,
        MasterDetailsModelIntentHandler = require('./handlers/guided/MasterDetailsModelIntentHandler.js').MasterDetailsModelIntentHandler,
        MoveBoardModelIntentHandler = require('./handlers/advanced/MoveBoardModelIntentHandler').MoveBoardModelIntentHandler,
        PersonalPagesModelIntentHandler = require('./handlers/guided/PersonalPagesModelIntentHandler.js').PersonalPagesModelIntentHandler,
        ResizeElementModelIntentHandler = require('./handlers/advanced/ResizeElementModelIntentHandler.js').ResizeElementModelIntentHandler,
        SelectElementModelIntentHandler = require('./handlers/advanced/SelectElementModelIntentHandler.js').SelectElementModelIntentHandler,
        SessionEndedRequestHandler = require('./handlers/defaults/SessionEndedRequestHandler.js').SessionEndedRequestHandler,
        ShareContentModelIntentHandler = require('./handlers/guided/ShareContentModelIntentHandler.js').ShareContentModelIntentHandler,
        SocialNetworkModelIntentHandler = require('./handlers/guided/SocialNetworkModelIntentHandler.js').SocialNetworkModelIntentHandler,
        WizardModelIntentHandler = require('./handlers/guided/WizardModelIntentHandler.js').WizardModelIntentHandler,
        ZoomModelIntentHandler = require('./handlers/advanced/ZoomModelIntentHandler.js').ZoomModelIntentHandler
    )
    .addRequestInterceptors(cleanAttributesInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();
