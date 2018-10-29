// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

exports.patterns = [
  {
    category: "Content Management",
    list: [
      {id: "page-based-content-management", title: "Page Based Content Management", type: "content-modification", image: "patterns/preview/page-based-content-management.png", description: "In blogs and page-based content management systems there is a fixed schema consisting of a hierarchical collection of pages. In these systems an intuitive interface is made available to the user, in order to adding new pages, editing their content, organizing pages in hierarchies, defining the pages' order in menus, and setting the graphical properties and visibility of pages. This pattern meets all the specific needs of a page-based content-management system.", html: require("../patterns/collection/page-based-content-management/page-based-content-management.html"), createPattern: require("../patterns/collection/page-based-content-management/index.js").SettingsPattern}
    ]
  },
  {
    category: "Content Navigation",
    list: [
      {id: "alphabetical-filter", title: "Alphabetical Filter", type: "content-navigation", image: "patterns/preview/alphabetical-filter.png", description: "When the objects to be accessed are numerous but possess a meaningful attribute that allows them to be accessed alphabetically, a useful access pattern consists of providing an alphabetic filter to partition the collection into chunks.", html: require("../patterns/collection/alphabetical-filter/alphabetical-filter.html"), createPattern: require("../patterns/collection/alphabetical-filter/index.js").SettingsPattern},
      {id: "breadcrumbs", title: "Breadcrumbs", type: "content-navigation", image: "patterns/preview/breadcrumbs.png", description: "Breadcrumb is a navigation aid that shows the user's location in the application interface.Breadcrumb navigation is used especially in large web application endowed with a hierarchical organization of pages or content items.", html: require("../patterns/collection/breadcrumbs/breadcrumbs.html"), createPattern: require("../patterns/collection/breadcrumbs/index.js").SettingsPattern},
      {id: "master-detail", title: "Master Detail", type: "content-navigation", image: "patterns/preview/master-detail.png", description: "The master detail pattern is the simplest data access pattern. A list ViewComponent is used to present some instances (the so called master list), and a selection Event permits the user to access the details of one instance at a time.", html: require("../patterns/collection/master-detail/master-detail.html"), createPattern: require("../patterns/collection/master-detail/index.js").SettingsPattern},
      {id: "multilevel-master-detail", title: "Multilevel Master Detail", type: "content-navigation", image: "patterns/preview/multilevel-master-detail.png", description: "Sometimes called \"cascaded index\" it consists of a sequence of List ViewComponents defined over distinct classes, such that each List specifies a change of focus from one object (selected from the index) to the set of objects related to it via an association role. In the end, a single object is shown in a Details ViewComponent, or several objects are shown in a List ViewComponent. A typical usage of the pattern exploits one or more data access classes to build a navigation path to the instances of a core class.", html: require("../patterns/collection/multilevel-master-detail/multilevel-master-detail.html"), createPattern: require("../patterns/collection/multilevel-master-detail/index.js").SettingsPattern},
      {id: "up-back-navigation", title: "Up and Back Navigation", type: "content-navigation", image: "patterns/preview/up-back-navigation.png", description: "The Up and Back navigation links are classic orientation helpers. In particular: the Up link refers to some hierarchical structure associated with the interface. It leads the user to the superior ViewElement in the View hierarchy. Instead, the Back link refers to the chronology of the user's interaction; it leads back in time to the last visited ViewElement.", html: require("../patterns/collection/up-back-navigation/up-back-navigation.html"), createPattern: require("../patterns/collection/up-back-navigation/index.js").SettingsPattern}
    ]
  },
  {
    category: "Content Search",
    list: [
      {id: "basic-search", title: "Basic Search", type: "content-search", image: "patterns/preview/basic-search.png", description: "In the Basic Search pattern a Form ViewComponent with one simple field is used to input a search key. This key is used as the value of a parameter in the ConditionalExpression of a List ViewComponent that displays all the instances of a class that contain the keyword.", html: require("../patterns/collection/basic-search/basic-search.html"), createPattern: require("../patterns/collection/basic-search/index.js").SettingsPattern},
      {id: "facet-search", title: "Faceted Search", type: "content-search", image: "patterns/preview/faceted-search.png", description: "Faceted search is a modality of information retrieval particularly well suited to structured multidimensional data. It is used to allow the progressive refinement of the search results by restricting the objects that match the query based in their properties, called facets. By selecting one or more values of some of the facets, the result set is narrowed down to only those objects that possess the selected values.", html: require("../patterns/collection/faceted-search/faceted-search.html"), createPattern: require("../patterns/collection/faceted-search/index.js").SettingsPattern},
      {id: "restricted-search", title: "Restricted Search", type: "content-search", image: "patterns/preview/restricted-search.png", description: "Search over large collections of objects can be made more efficient by restricting the focus to specific subcollections. This can be done by a mixed pattern that exploits both content search and access categories.", html: require("../patterns/collection/restricted-search/restricted-search.html"), createPattern: require("../patterns/collection/restricted-search/index.js").SettingsPattern}
    ]
  },
  {
    category: "Data Entry",
    list: [
      {id: "input-data-validation", title: "Input Data Validation", type: "data-entry", image: "patterns/preview/input-data-validation.png", description: "The input data validation pattern ensure that the input provided by the user meets the application requirements.", html: require("../patterns/collection/input-data-validation/input-data-validation.html"), createPattern: require("../patterns/collection/input-data-validation/index.js").SettingsPattern},
      {id: "wizard", title: "Wizard", type: "data-entry", image: "patterns/preview/wizard.png", description: "The wizard design pattern supports the partition of a data entry procedure into logical steps that must be followed in a predetermined sequence. Depending on the step reached, the user can move forward or backward without losing the partial selections made up to that point.", html: require("../patterns/collection/wizard/wizard.html"), createPattern: require("../patterns/collection/wizard/index.js").SettingsPattern}
    ]
  },
  {
    category: "Identification Authorization",
    list: [
      {id: "in-place-sign-in", title: "In-Place Sign In", type: "identification-authorization", image: "patterns/preview/in-place-sign-in.png", description: "The in-place sign-in pattern, typical of the web applications, occurs when a user who is not currently authenticated in the application wants to perform an action that requires identification. When the user attempts to trigger the action, he must be warned of the need to sign in first and be routed to the Log In form. When the user has successfully signed in, he must be returned to the interface element from which he requested the initial action. When handling the submission of information, any data entered prior to the Log In procedure must also be preserved.", html: require("../patterns/collection/in-place-sign-in/in-place-sign-in.html"), createPattern: require("../patterns/collection/in-place-sign-in/index.js").SettingsPattern},
      {id: "log", title: "Log", type: "identification-authorization", image: "patterns/preview/log.png", description: "This pattern address the identification and authorization of user within the application. The user enters credentials using a Form in a public access ViewContainer, and such input is verified against the contest of an identity repository. Upon success, a <<Normal Termination>> ActionEvent is raised by the Log In Action, the user is authenticated, and this information is preserved in the Context. Upon failure, the Exceptional Termination ActionEvent is raised, which can be trapped by the application to give the user an appropriate warning message. The information about the user's authenticated identity preserved in the Context can be cleared by the initiative of the user by means of a <<Log Out>> Action. The typical pattern comprises an event that triggers the Action, which normally terminates without exceptions. After the <<Log Out>> Action is completed, the user is shown the same source ViewContainer, but as a side effect of the log out process, the identity information in the Context is no longer defined and the access to all the private information of the application is denied.", html: require("../patterns/collection/log/log.html"), createPattern: require("../patterns/collection/log/index.js").SettingsPattern}
    ]
  }
];