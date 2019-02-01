// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

// Import dependences
var _ = require('lodash'),
    $ = require('jquery'),
    document = require('document'),
    path = require('path'),
    joint = require('joint'),
    Blob = require('Blob'),
    saveAs = require('FileSaver'),
    FileReader = require('FileReader'),
    createBoard = require('almost-joint').createBoard,
    ifml = require('./ifml').ifml,
    pcn = require('./pcn').pcn,
    ifml2pcn = require('./ifml2pcn').ifml2pcn,
    defaultLink = require('./defaultlink').defaultLink,
    isValidParent = require('./isvalidparent').isValidParent,
    createStatisticsMenu = require('./statistics').StatisticsMenu,
    createModalEdit = require('./modaledit').ModalEdit,
    createModalStatistics = require('./modalstatistics').ModalStatistics,
    createModalDB = require('./modaldb').ModalDB,
    createModalExamples = require('./modalexamples').ModalExamples,
    createModalPatterns = require('./modalpatterns').ModalPatterns,
    examples = require('./examples').examples,
    patterns = require('./patterns').patterns,
    patternBrain = require('../patterns/utilities/patternBrain.js').patternBrain,
    ifml2code = require('./ifml2code').ifml2code,
    createIFBrowser = require('./ifbrowser').IFBrowser,
    createIFClient = require('./ifclient').IFClient,
    AException = require('almost').Exception,
    partialModelValidator = require('./ifml/utilities/validator/partialModelValidator.js').partialModelValidator,
    askTemplates = require('./ask-templates.js').templates,
    io = require('socket.io-client'),
    generator = require('./ifml/utilities/generator/elementGenerator.js').generator,
    toId = require('./ifml/utilities/validator/toId.js').toId,
    idValidator = require('./ifml/utilities/validator/idValidator.js').idValidator;

/**
  * Return a function to generate an element
  * @param {Object} Element - the element that the function must generate
  */
function toBuilder(Element) { return function () { return [new Element()]; }; }

/**
  * Variables initialization
  *   - ifmlModel           : reference to a joint Graph, that represents the structure of the model diagram
  *   - ifmlBuilders        : array of model element constructors
  *   - ifmlBoard           : reference to an almost-joint Board, created to manage the joint Paper (and, consequently, the joint Graph) of the model
  *                           The functionalities made available by the Board allow the interactions of the user with the UI of the model editor,
  *                           so that he can create, delete, move, resize, connect and (more generally) graphically manipulate elements
  *                           (The corresponding view is positioned on the center of the model editor)
  *   - ifmlMenu            : reference to the menu elements builder (whose view is positioned on the right side bar of the model editor)
  *   - statisticsModel     : reference to a joint Graph, that represents the structure of the statistics model diagram
  *   - statisticsBoard     : reference to an almost-joint Board, created to manage the joint Paper (and, consequently, the joint Graph) of the statistics model
  *   - statisticsMenuColor :
  *   - statisticsMenuIn    :
  *   - statisticsMenuOut   :
  *   - pcnModel            : reference to a joint Graph, that represents the structure of the pcn model diagram
  *   - pcnBuilders         : array of pcn element constructors
  *   - pcnBoard            : reference to an almost-joint Board, created to manage the joint Paper (and, consequently, the joint Graph) of the pcn model
  *   - pcnMenu             :
  *   - pcnSimulator        :
  *   - ifbrowser           :
  *   - ifclient            :
  *   - ifmobile            :
  */

var ifmlModel = new joint.dia.Graph(),
    //ifmlBuilders = _.values(ifml.elements).map(toBuilder).concat(_.values(ifml.extensions).map(toBuilder)).concat(_.values(ifml.nets)),
    ifmlBuilders = _.values(ifml.elements).map(toBuilder).concat(_.values(ifml.nets)),
    ifmlBoard = createBoard({
        el: '#ifml > .board',
        model: ifmlModel,
        defaultLink: defaultLink,
        isValidParent: isValidParent
    }),
    ifmlMenu = ifmlBoard.createElementsMenu({
        container: '#ifml > .sidebar > ul',
        template: '<a class="list-group-item almost-place-holder"></a>',
        builders: ifmlBuilders,
        width: 170
    }),
    statisticsModel = new joint.dia.Graph(),
    statisticsBoard = createBoard({
        el: '#statistics > .board',
        model: statisticsModel,
        defaultLink: defaultLink,
        isValidParent: isValidParent,
        readonly: true,
        magnetize: false,
        resize: false,
        rotate: false,
        actions: [{
            marker: require('./statistics.svg'),
            checker: function (model) {
                if (model.statistics) {
                    var statistics = model.statistics();
                    return statistics && statistics.length;
                }
            },
            event: 'statistics'
        }]
    }),
    statisticsMenuColor = createStatisticsMenu({
        ul: '#statistics > .sidebar > ul.statistics-color',
        model: statisticsModel,
        position: 'color',
        property: 'accent',
        normalize: true
    }),
    statisticsMenuIn = createStatisticsMenu({
        ul: '#statistics > .sidebar > ul.statistics-in',
        model: statisticsModel,
        position: 'in',
        property: 'accent-in'
    }),
    statisticsMenuOut = createStatisticsMenu({
        ul: '#statistics > .sidebar > ul.statistics-out',
        model: statisticsModel,
        position: 'out',
        property: 'accent-out'
    }),
    pcnModel = new joint.dia.Graph(),
    pcnBuilders = _.values(pcn.elements).map(toBuilder).concat(_.values(pcn.nets)),
    pcnBoard = createBoard({
        el: '#pcn > .board',
        model: pcnModel,
        defaultLink: defaultLink,
        isValidParent: isValidParent
    }),
    pcnMenu = pcnBoard.createElementsMenu({
        container: '#pcn > .sidebar > ul',
        template: '<a class="list-group-item almost-place-holder"></a>',
        builders: pcnBuilders,
        width: 170
    }),
    pcnSimulator = pcn.Simulator({model: pcnModel, paper: pcnBoard.paper()}),
    ifbrowser = createIFBrowser({
        el: '#web-server .ifbrowser',
        address: '#web-server .ifbrowser-address',
        back: '#web-server .ifbrowser-back',
        forward: '#web-server .ifbrowser-forward',
        repeat: '#web-server .ifbrowser-repeat',
        go: '#web-server .ifbrowser-go',
        BASE_PATH: BASE_PATH + 'web-server/'
    }),
    ifclient = createIFClient({el: '#web-client .ifclient', BASE_PATH: BASE_PATH + 'web-client/'}),
    ifmobile = createIFClient({el: '#mobile .ifmobile-wrapper', BASE_PATH: BASE_PATH + 'mobile/', scrolling: 'no'});


ifmlBoard.zoomE();
statisticsBoard.zoomE();
pcnBoard.zoomE();

function editIfmlElement(cellView) {
    createModalEdit({cell: cellView.model, board: ifmlBoard});
}

function editPcnElement(cellView) {
    createModalEdit({cell: cellView.model, board: pcnBoard});
}

function patternLoad(cellView) {
    try {
        createModalPatterns({patterns: patterns, type: 'update', cell: cellView.model});
    } catch (exception) {
        console.log(exception);
        ifmlBoard.clearHistory();
        $.notify({message: 'Something goes wrong...'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
}

function patternMatching(cellView) {
    try {
        patternBrain({cell: cellView.model, patterns: patterns, load: createModalPatterns });
    } catch (exception) {
        console.log(exception);
        ifmlBoard.clearHistory();
        $.notify({message: 'Something goes wrong...'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
}

function showElementStatistics(cellView) {
    createModalStatistics({cell: cellView.model});
}

ifmlBoard.on('cell:edit cell:pointerdblclick link:options', editIfmlElement);
ifmlBoard.on('cell:pattern-load', patternLoad);
ifmlBoard.on('cell:pattern-brain', patternMatching);
statisticsBoard.on('cell:statistics cell:pointerdblclick link:options', showElementStatistics);
pcnBoard.on('cell:edit cell:pointerdblclick', editPcnElement);

var loaded_at = new Date();

$('.slider-arrow').click(function () {
    if($(this).hasClass('open')){
      $('.sidebar').animate({ left: '-=180' }, { duration: 700, queue: false });
      $('.slider-arrow').animate({ left: '-=180' }, { duration: 700, queue: false });
      $('.slider-arrow').animate({ deg: 180 },
        { duration: 700,
          queue: false,
          step: function(now) {
            $(this).css({ transform: 'rotate('+ now +'deg)'});
          }
        }
      );
    } else {
      $('.sidebar').animate({ left: '+=180' }, { duration: 700, queue: false });
      $('.slider-arrow').animate({ left: '+=180' }, { duration: 700, queue: false });
      $('.slider-arrow').animate({ deg: 0 }, { duration: 700, queue: false, step: function(now) {
            $(this).css({ transform: 'rotate('+ now +'deg)'});
      }});
    }
    $('.slider-arrow').toggleClass('open');
});

$('#ifml > .wrapper-download-png-modal').click(function () {
    ifmlBoard.download();
    return false;
});

$('#ifml > .wrapper-download-model-modal').click(function () {
    var model = ifml.toJSON(ifmlModel);
    model.statistics = {
        session: {
            started_at: loaded_at,
            ended_at: new Date()
        }
    };
    saveAs(new Blob([JSON.stringify(model)], {type: 'application/json'}), 'ifml.json');
    return false;
});

$('#ifml > .load > input[type=file]').change(function () {
    var reader = new FileReader();

    reader.onload = function (e) {
        ifmlModel.clear();
        ifmlBoard.clearHistory();
        try {
            var start = new Date();
            ifmlModel.addCells(ifml.fromJSON(JSON.parse(e.target.result)));
            ifmlBoard.clearHistory();
            $.notify({message: 'File loaded in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
            loaded_at = new Date();
        } catch (exception) {
            ifmlBoard.clearHistory();
            $.notify({message: 'Invalid input file!'}, {allow_dismiss: true, type: 'danger'});
            return;
        }
        ifmlBoard.zoomE();
    };

    reader.onerror = function () {
        $.notify({message: 'Error loading file!'}, {allow_dismiss: true, type: 'danger'});
    };

    reader.readAsText(this.files[0]);

    this.value = '';
});

$('#ifml > .wrapper-load-modal').click(function () {
    $('#ifml > .load > input[type=file]').click();
    return false;
});

$('#ifml > .append > input[type=file]').change(function () {
    var reader = new FileReader();
    reader.onload = function (e) {
        try{
          ifmlBoard.clearHistory();

          function boundingBox(cells) {
              var box = {
                  x: {
                      min: Number.MAX_SAFE_INTEGER,
                      max: Number.MIN_SAFE_INTEGER
                  },
                  y: {
                      min: Number.MAX_SAFE_INTEGER,
                      max: Number.MIN_SAFE_INTEGER
                  }
              };
              cells.map(function(element) {
                  if(element.attributes.type == 'ifml.ViewContainer' ||
                      element.attributes.type == 'ifml.Action'){
                      if (element.attributes.position.x < box.x.min) {
                          box.x.min = element.attributes.position.x;
                      }
                      if (element.attributes.position.y < box.y.min) {
                          box.y.min = element.attributes.position.y;
                      }
                      if (element.attributes.position.x + element.attributes.size.width > box.x.max) {
                          box.x.max = element.attributes.position.x + element.attributes.size.width;
                      }
                      if (element.attributes.position.y + element.attributes.size.height > box.y.max) {
                          box.y.max = element.attributes.position.y + element.attributes.size.height;
                      }
                  }
              });
              return box;
          }

          var start = new Date();

          loaded_at = new Date();

          if (ifmlModel.attributes.cells.models.length == 0) {
              $.notify({message: 'The board is empty, please use Load Model!'}, {allow_dismiss: true, type: 'warning'});
              return;
          }
          var toBeAdded = ifml.fromJSON(partialModelValidator(ifml.toJSON(ifmlModel), JSON.parse(e.target.result)));
          var boardBB = boundingBox(ifmlModel.attributes.cells.models),
              toBeAddedBB = boundingBox(toBeAdded);
          toBeAdded = _(toBeAdded).map(function(model) {
              if (model.attributes.position) {
                  model.attributes.position.x += boardBB.x.max - toBeAddedBB.x.min + 20;
                  model.attributes.position.y += boardBB.y.min - toBeAddedBB.y.min;
              }
              if (model.attributes.vertices) {
                  for (var i = 0; i<model.attributes.vertices.length; i++){
                      model.attributes.vertices[i].x += boardBB.x.max - toBeAddedBB.x.min + 20;
                      model.attributes.vertices[i].y += boardBB.y.min - toBeAddedBB.y.min;
                  }
              }
              return model;
          }).value();
          ifmlModel.addCells(toBeAdded);
          ifmlBoard.clearHistory();

          $.notify({message: 'File loaded in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
        } catch (exception) {
              console.log(exception);
              ifmlBoard.clearHistory();
              $.notify({message: 'Invalid input file!'}, {allow_dismiss: true, type: 'danger'});
              return;
        }
        ifmlBoard.zoomE();
    };

    reader.onerror = function () {
        $.notify({message: 'Error loading file!'}, {allow_dismiss: true, type: 'danger'});
    };

    reader.readAsText(this.files[0]);

    this.value = '';
});

$('#ifml > .wrapper-append-modal').click(function () {
    $('#ifml > .append > input[type=file]').click();
    return false;
});

$('#ifml > .wrapper-example-modal').click(function () {
    createModalExamples({examples: examples, load: function (example) {
        $.getJSON(example.url, function (result) {
            ifmlModel.clear();
            ifmlBoard.clearHistory();
            try {
                var start = new Date();
                ifmlModel.addCells(ifml.fromJSON(result));
                ifmlBoard.clearHistory();
                $.notify({message: 'File loaded in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
                loaded_at = new Date();
            } catch (exception) {
                ifmlModel.clear();
                ifmlBoard.clearHistory();
                $.notify({message: 'Invalid input file!'}, {allow_dismiss: true, type: 'danger'});
                return;
            }
            ifmlBoard.zoomE();
        });
    }});
    return false;
}).click();

$('#ifml > .wrapper-pattern-modal').click(function () {
    createModalPatterns({patterns: patterns, type: 'create', load: function (pattern) {
        try {
          ifmlBoard.clearHistory();

          function boundingBox(cells) {
              var box = {
                  x: {
                      min: Number.MAX_SAFE_INTEGER,
                      max: Number.MIN_SAFE_INTEGER
                  },
                  y: {
                      min: Number.MAX_SAFE_INTEGER,
                      max: Number.MIN_SAFE_INTEGER
                  }
              };
              cells.map(function(element) {
                  if(element.attributes.type == 'ifml.ViewContainer' ||
                      element.attributes.type == 'ifml.Action'){
                      if (element.attributes.position.x < box.x.min) {
                          box.x.min = element.attributes.position.x;
                      }
                      if (element.attributes.position.y < box.y.min) {
                          box.y.min = element.attributes.position.y;
                      }
                      if (element.attributes.position.x + element.attributes.size.width > box.x.max) {
                          box.x.max = element.attributes.position.x + element.attributes.size.width;
                      }
                      if (element.attributes.position.y + element.attributes.size.height > box.y.max) {
                          box.y.max = element.attributes.position.y + element.attributes.size.height;
                      }
                  }
              });
              return box;
          }
          var start = new Date();

          loaded_at = new Date();

          var boardBB = {
              x: {
                  min: 0,
                  max: 0
              },
              y: {
                  min: 0,
                  max: 0
              }
          };

          var toBeAdded = ifml.fromJSON(pattern),
              toBeAddedBB = boundingBox(toBeAdded);

          if (ifmlModel.attributes.cells.models.length > 0) {
              boardBB = boundingBox(ifmlModel.attributes.cells.models);
              toBeAdded = ifml.fromJSON(partialModelValidator(ifml.toJSON(ifmlModel), pattern));
          }

          toBeAdded = _(toBeAdded).map(function(model) {
              if (model.attributes.position) {
                  model.attributes.position.x += boardBB.x.max - toBeAddedBB.x.min + 20;
                  model.attributes.position.y += boardBB.y.min - toBeAddedBB.y.min;
              }
              if (model.attributes.vertices) {
                  for (var i = 0; i<model.attributes.vertices.length; i++){
                      model.attributes.vertices[i].x += boardBB.x.max - toBeAddedBB.x.min + 20;
                      model.attributes.vertices[i].y += boardBB.y.min - toBeAddedBB.y.min;
                  }
              }
              return model;
          }).value();

          ifmlModel.addCells(toBeAdded);
          ifmlBoard.clearHistory();

          $.notify({message: 'File loaded in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
        } catch (exception) {
            console.log(exception);
            ifmlBoard.clearHistory();
            $.notify({message: 'Invalid input file!'}, {allow_dismiss: true, type: 'danger'});
            return;
        }
        ifmlBoard.zoomE();
    }});
    return false;
});

$('#statistics > input[type=file]').change(function () {
    var reader = new FileReader(),
        model = ifml.toJSON(ifmlModel);

    reader.onload = function (e) {
        statisticsModel.clear();
        statisticsMenuColor.clear();
        statisticsMenuIn.clear();
        statisticsMenuOut.clear();
        try {
            var start = new Date(),
                statistics = JSON.parse(e.target.result);
            model.elements.forEach(function (element) {
                var stats = statistics.analytics[element.id];
                if (stats) {
                    element.metadata.statistics = stats;
                }
            });
            statisticsModel.addCells(ifml.fromJSON(model));
            statisticsMenuColor.reload();
            statisticsMenuIn.reload();
            statisticsMenuOut.reload();
            $.notify({message: 'File loaded in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
            loaded_at = new Date();
        } catch (exception) {
            statisticsModel.clear();
            statisticsMenuColor.clear();
            statisticsMenuIn.clear();
            statisticsMenuOut.clear();
            $.notify({message: 'Invalid input file!'}, {allow_dismiss: true, type: 'danger'});
            return;
        }
        statisticsBoard.zoomE();
    };

    reader.onerror = function () {
        $.notify({message: 'Error loading file!'}, {allow_dismiss: true, type: 'danger'});
    };

    reader.readAsText(this.files[0]);

    this.value = '';
});

$('#statistics > .sidebar .model-load').click(function () {
    $('#statistics > input[type=file]').click();
    return false;
});

$('#pcn > .sidebar .png-download').click(function () {
    pcnBoard.download();
    return false;
});

$('#pcn > .sidebar .model-generate').click(function () {
    var start = new Date();
    pcnSimulator.stop();
    pcnModel.clear();
    pcnBoard.clearHistory();
    pcnModel.addCells(pcn.fromJSON(ifml2pcn.mobile(ifml.toJSON(ifmlModel))));
    pcnBoard.zoomE();
    pcnBoard.clearHistory();
    $.notify({message: 'Convertion completed in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
    return false;
});

$('#pcn-simulate').click(function () {
    if ($(this).is(':checked')) {
        pcnSimulator.start();
    } else {
        pcnSimulator.stop();
    }
});

pcnSimulator.on('stop', function () { $('#pcn-simulate').prop('checked', false); });

$('#web-server .zip-download').click(function () {
    try {
        var start = new Date();
        saveAs(ifml2code.server(ifml.toJSON(ifmlModel)).generate({type: 'blob'}), 'webexample.zip');
        $.notify({message: 'Convertion completed in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
    } catch (e) {
        if (e instanceof AException) {
            $.notify({title: "<strong>Convertion Failed</strong><br>", message: e.message.replace(/\n/g, '<br>')}, {allow_dismiss: true, type: 'danger'});
        } else {
            $.notify({title: 'Convertion Failed.'}, {allow_dismiss: true, type: 'danger'});
        }
    }
    return false;
});

$('#web-server .zip-try').click(function () {
    try {
        var start = new Date();
        ifbrowser.start(ifml2code.server(ifml.toJSON(ifmlModel)).generate({type: 'string'}));
        ifbrowser.reload();
        $.notify({message: 'Convertion completed in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
    } catch (e) {
        if (e instanceof AException) {
            $.notify({title: "<strong>Convertion Failed</strong><br>", message: e.message.replace(/\n/g, '<br>')}, {allow_dismiss: true, type: 'danger'});
        } else {
            $.notify({title: 'Convertion Failed.'}, {allow_dismiss: true, type: 'danger'});
        }
    }
    return false;
});

$('#web-client .zip-download').click(function () {
    try {
        var start = new Date();
        saveAs(ifml2code.client(ifml.toJSON(ifmlModel)).generate({type: 'blob'}), 'clientexample.zip');
        $.notify({message: 'Convertion completed in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
    } catch (e) {
        if (e instanceof AException) {
            $.notify({title: "<strong>Convertion Failed</strong><br>", message: e.message.replace(/\n/g, '<br>')}, {allow_dismiss: true, type: 'danger'});
        } else {
            $.notify({title: 'Convertion Failed.'}, {allow_dismiss: true, type: 'danger'});
        }
    }
    return false;
});

$('#web-client .zip-try').click(function () {
    try {
        var start = new Date();
        ifclient.start(ifml2code.client(ifml.toJSON(ifmlModel)).generate({type: 'string'}));
        $.notify({message: 'Convertion completed in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
    } catch (e) {
        if (e instanceof AException) {
            $.notify({title: "<strong>Convertion Failed</strong><br>", message: e.message.replace(/\n/g, '<br>')}, {allow_dismiss: true, type: 'danger'});
        } else {
            $.notify({title: 'Convertion Failed.'}, {allow_dismiss: true, type: 'danger'});
        }
    }
    return false;
});

$('#mobile #cordova .zip-download').click(function () {
    try {
        var start = new Date();
        saveAs(ifml2code.mobile(ifml.toJSON(ifmlModel)).generate({type: 'blob'}), 'mobileexample.zip');
        $.notify({message: 'Convertion completed in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
    } catch (e) {
        if (e instanceof AException) {
            $.notify({title: "<strong>Convertion Failed</strong><br>", message: e.message.replace(/\n/g, '<br>')}, {allow_dismiss: true, type: 'danger'});
        } else {
            $.notify({title: 'Convertion Failed.'}, {allow_dismiss: true, type: 'danger'});
        }
    }
    return false;
});

$('#mobile #flutter .zip-download').click(function () {
    try {
        var start = new Date();
        saveAs(ifml2code.flutter(ifml.toJSON(ifmlModel)).generate({type: 'blob'}), 'flutterexample.zip');
        $.notify({message: 'Convertion completed in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
    } catch (e) {
        if (e instanceof AException) {
            $.notify({title: "<strong>Convertion Failed</strong><br>", message: e.message.replace(/\n/g, '<br>')}, {allow_dismiss: true, type: 'danger'});
        } else {
            $.notify({title: 'Convertion Failed.'}, {allow_dismiss: true, type: 'danger'});
        }
    }
    return false;
});

$('#mobile .zip-try').click(function () {
    try {
        var start = new Date();
        ifmobile.start(ifml2code.mobile(ifml.toJSON(ifmlModel)).generate({type: 'string'}));
        $.notify({message: 'Convertion completed in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
    } catch (e) {
        if (e instanceof AException) {
            $.notify({title: "<strong>Convertion Failed</strong><br>", message: e.message.replace(/\n/g, '<br>')}, {allow_dismiss: true, type: 'danger'});
        } else {
            $.notify({title: 'Convertion Failed.'}, {allow_dismiss: true, type: 'danger'});
        }
    }
    return false;
});

$('#web-server .edit-db').click(function () {
    createModalDB({emulator: ifbrowser});
    return false;
});

$('#web-client .edit-db').click(function () {
    createModalDB({emulator: ifclient});
    return false;
});

$('#mobile .edit-db').click(function () {
    createModalDB({emulator: ifmobile});
    return false;
});

$('#pcn').removeClass('active');


var socket = io("http://localhost:3000"),
    selectedElement;

socket.on('notify', notify);
socket.on('demo', demo);
socket.on('e-commerce', ecommerce);
socket.on('blog', blog);
socket.on('crowdsourcing', crowdsourcing);
socket.on('social-network', socialnetwork);
socket.on('zoom', zoom);
socket.on('move-board', moveBoard);
socket.on('generate-view-container', generateViewContainer);
socket.on('delete', deleteElement);
socket.on('drag-and-drop', dragDropElement);
socket.on('select', selectElement);
socket.on('resize', resizeElement);
socket.on('insert', insertElement)

function notify(options){
    $.notify({message: options.message}, {allow_dismiss: true, type: options.messageType});
}

function demo(options) {
    var template = askTemplates[options.template].model;
    voiceAssistantModelGenerator(template);
}

function zoom(options) {
    if (options.times > 4) {
      options.times = 1;
    }
    var delta = options.zoom === 'zoom in' ? 0.4 : -0.4,
        zoom = options.zoom,
        times = options.times * 20;

    ifmlBoard.zoomVoiceAssistant(times,delta);
}

function moveBoard(options) {
    if (options.times > 4) {
      options.times = 1;
    }
    var move = options.move,
        times = options.times * 300,
        delta = {};

    try {
        switch (move) {
          case 'move up':
            delta.x = 0;
            delta.y = -1;
            break;
          case 'move down':
            delta.x = 0;
            delta.y = 1;
            break;
          case 'move right':
            delta.x = 1;
            delta.y = 0;
            break;
          case 'move left':
            delta.x = -1;
            delta.y = 0;
            break;
          default:
            throw 'Unexpected move request';
            break;
        }
    } catch (exception) {
        console.log(exception);
        ifmlBoard.clearHistory();
        $.notify({message: 'Something goes wrong...'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    ifmlBoard.moveBoardVoiceAssistant(times,delta);
}

function generateViewContainer(options) {
    var id = toId(options.name,'view-container'),
        properties = options.properties,
        template = {
            elements: [],
            relations: []
        };

    if (properties.xor) {
        if (!properties.parent) {
            $.notify({message: 'You try to insert a View Container with XOR property in a position not allowed by the hierarchy of the elements.'}, {allow_dismiss: true, type: 'danger'});
            return;
        } else {
            var parent = ifmlModel.getCell(properties.parent);
            if (parent.attributes.xor) {
                $.notify({message: 'You try to insert a View Container with XOR property in a position not allowed by the hierarchy of the elements (the parent is a XOR View Container).'}, {allow_dismiss: true, type: 'danger'});
                return;
            }
        }
    }
    if (properties.landmark || properties.default) {
        if (properties.parent) {
            var parent = ifmlModel.getCell(properties.parent);
            if (!parent.attributes.xor) {
                $.notify({message: 'You try to insert a View Container with Landmark or Default property in a position not allowed by the hierarchy of the elements (the parent is not a XOR View Container).'}, {allow_dismiss: true, type: 'danger'});
                return;
            }
        }
    }
    if (options.parent) {
        var parent = ifmlModel.getCell(properties.parent);
        if (!parent) {
            $.notify({message: 'The parent does not exist'}, {allow_dismiss: true, type: 'danger'});
            return;
        }
    }

    if (!options.parent) {
        template.elements.push(generator(template, {
            type: 'ifml.ViewContainer',
            id: idValidator(id),
            name: options.name,
            xor: properties.xor,
            landmark: properties.landmark,
            default: properties.default,
            parent: options.parent || undefined
        }));
        voiceAssistantModelGenerator(template);
    }
}

function deleteElement(options) {
    var id = [toId(options.name)],
        template = delator(id,ifml.toJSON(ifmlModel));
    voiceAssistantModelGenerator(template);
}

function dragDropElement (options) {
    var name = options.name,
        type = options.type.toLowerCase().replace(/\W/g,"-"),
        id = toId(name,'-' + type),
        firstDirection = options.firstDirection,
        firstDelta = options.firstDelta,
        secondDirection = options.secondDirection,
        secondDelta = options.secondDelta,
        delta = {
            x: 0,
            y: 0
        };

    var element = ifmlModel.getCell(id);

    if (element) {
        try {
            switch (firstDirection) {
              case 'up':
                delta.y -= firstDelta;
                break;
              case 'down':
                delta.y += firstDelta;
                break;
              case 'right':
                delta.x += firstDelta;
                break;
              case 'left':
                delta.x -= firstDelta;
                break;
              default:
                throw 'Unexpected move request';
                break;
            }

            if (secondDirection && secondDelta) {
                switch (secondDirection) {
                  case 'up':
                    delta.y -= secondDelta;
                    break;
                  case 'down':
                    delta.y += secondDelta;
                    break;
                  case 'right':
                    delta.x += secondDelta;
                    break;
                  case 'left':
                    delta.x -= secondDelta;
                    break;
                  default:
                    throw 'Unexpected move request';
                    break;
                }
            }
        } catch (exception) {
            console.log(exception);
            ifmlBoard.clearHistory();
            $.notify({message: 'Something goes wrong...'}, {allow_dismiss: true, type: 'danger'});
            return;
        }

        ifmlBoard.dragDropElementVoiceAssistant(element,delta);
    } else {
        $.notify({message: 'Element not found...'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
}

function selectElement(options) {
    var name = options.name,
        type = options.type.toLowerCase().replace(/\W/g,"-"),
        id = toId(name,'-' + type),
        element = ifmlModel.getCell(id);

    if (element) {
        selectedElement = element;
    } else {
        $.notify({message: 'Element not found...'}, {allow_dismiss: true, type: 'danger'});
    }
}

function resizeElement (options) {
    var name = options.name,
        type = options.type ? options.type.toLowerCase().replace(/\W/g,"-") : undefined,
        id = name ? toId(name,'-' + type) : undefined,
        direction,
        delta = options.delta;

    var element = id ? ifmlModel.getCell(id) : selectedElement;

    if (element) {
        try {
            switch (options.direction) {
              case 'up':
                direction = 'n'
                break;
              case 'down':
                direction = 's'
                break;
              case 'right':
                direction = 'e'
                break;
              case 'left':
                direction = 'w'
                break;
              default:
                throw 'Unexpected resize request';
                break;
            }
        } catch (exception) {
            console.log(exception);
            ifmlBoard.clearHistory();
            $.notify({message: 'Something goes wrong...'}, {allow_dismiss: true, type: 'danger'});
            return;
        }

        ifmlBoard.resizeElementVoiceAssistant(element,delta,direction);
    } else {
        $.notify({message: 'Element not found... Select an existing element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
}

async function insertElement (options) {
    var elementName = options.name,
        elementType = options.type ? options.type.toLowerCase().replace(/\W/g,"-") : undefined,
        elementStereotype,
        size,
        parentName = options.parent,
        childName = options.child,
        childType = options.childType ? options.childType.replace(/\W/g,"-") : undefined,
        idElement = elementName ? toId(elementName,'-' + elementType) : undefined,
        idParent = parentName ? toId(parentName,'-view-container') : undefined,
        idChild = childName && childType ? toId(childName,'-' + childType) : undefined,
        position = options.position,
        elements = idElement && ifmlModel.getCell(idElement) ? _.flattenDeep([ifmlModel.getCell(idElement), ifmlModel.getCell(idElement).getEmbeddedCells({deep:'true'})]) : [],
        links = [],
        parent = idParent ? ifmlModel.getCell(idParent) : undefined,
        child = idChild ? ifmlModel.getCell(idChild) : undefined,
        recursion = options.recursion || false,
        template = {
            elements: [],
            relations: []
        };

    if (idChild && !child) {
        $.notify({message: 'Child element not found... Repeat the command and select an existing child element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
    if (child && parent && !(child.attributes.parent === parent.id)) {
        $.notify({message: 'The selected child is not really a child of the selected parent.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
    if (!parent) {
        $.notify({message: 'Parent element not found... Repeat the command and select an existing parent element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
    if (elements[0] && parent.id === ifmlModel.getCell(idElement).attributes.parent) {
        $.notify({message: 'The element is already insert in the selected parent view container.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
    if (elementType === 'event') {
        $.notify({message: 'Insert command is not available for the Event type. Use the generate command instead.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    var modelElements = ifmlModel.getElements(),
        rightToParent = parent.parent === undefined ? _.filter(modelElements, function (element) { return parent.position().x >= element.position().x && parent.id !== element.id }) : undefined,
        leftToParent = parent.parent === undefined ? _.filter(modelElements, function (element) { return (parent.position().x + parent.size().width) <= element.position().x && parent.id !== element.id }) : undefined,
        upToParent = parent.parent === undefined ? _.filter(modelElements, function (element) { return parent.position().y >= element.position().y && parent.id !== element.id }) : undefined,
        downToParent = parent.parent === undefined ? _.filter(modelElements, function (element) { return (parent.position().y + parent.size().height) <= element.position().y && parent.id !== element.id }) : undefined;

    if (!elements[0]) {
        switch (elementType) {
          case 'view-container':
            elementType = 'ifml.ViewContainer';
            size = { height: 160, width: 200 }
            break;
            break;
          case 'action':
            elementType = 'ifml.Action';
            size = { height: 50, width: 75 }
            break;
          case 'event':
            elementType = 'ifml.Event';
            size = { height: 20, width: 20 }
            break;
          case 'form':
            elementType = 'ifml.ViewComponent';
            elementStereotype = 'form';
            size = { height: 60, width: 150 }
            break;
          case 'list':
            elementType = 'ifml.ViewComponent';
            elementStereotype = 'list';
            size = { height: 60, width: 150 };
            break;
          case 'details':
            elementType = 'ifml.ViewComponent';
            elementStereotype = 'details';
            size = { height: 60, width: 150 };
            break;

        }

        template.elements.push(generator(template, {
            type: elementType,
            id: idValidator(idElement),
            name: options.name,
            text: options.name,
            stereotype: elementStereotype,
            parent: parent.id,
            size: size
        }));

        elements = [ifml.fromJSON({ elements: template.elements , relations: []})[0]];
    } else {
        if (!recursion) {
            var num = elements.length;
            elements = _.filter(elements, function (element) { return !element.isLink() });
            _.forEach(elements, function (element) {
                var connectedLinks = ifmlModel.getConnectedLinks(element);

                _.forEach(connectedLinks, function (link) {
                    fadeOut(link,'.connection');
                    fadeOut(link,'.marker-source');
                    fadeOut(link,'.marker-target');
                });

                links.push(connectedLinks);

                if (element.attributes.type === 'ifml.Event') {
                    fadeOut(element,'.marker');
                } else {
                    fadeOut(element,'.ifml-element');
                }
            });

            links = _.flattenDeep(links);
            await delay(num * 100);
        }
    }

    if (!child) {
        if (!recursion) {
            console.log(1);
            console.log(elements);
            _.forEach(elements, function (element) {
                element.position(parent.position().x + 20, parent.position().y + 40);
            })
        }
    } else {
        switch (position) {
          case 'up':
            var x = child.position().x - (elements[0].size().width/2 - child.size().width/2),
                y = child.position().y - (elements[0].size().height + 20);
            break;
          case 'down':
            var x = child.position().x - (child.size().width/2 - child.size().width/2),
                y = child.position().y + parent.size().height + 20;
            break;
          case 'right':
            var x = child.position().x + (child.size().width + 20),
                y = child.position().y - (elements[0].size().height/2 - child.size().height/2);
            break;
          case 'left':
            var x = child.position().x - elements[0].size().width - 20,
                y = child.position().y - (elements[0].size().height/2 - child.size().height/2);
            break;
        }

        var initialPos = elements[0].position();

        elements[0].position(x,y);

        _.forEach(elements, function (element,index) {
            if(index !== 0){
                var delta = {
                        x: Math.abs(initialPos.x - element.position().x),
                        y: Math.abs(element.position().y - initialPos.y)
                    };
                element.position(elements[0].position().x + delta.x, elements[0].position().y + delta.y);
            }
        })
    }
    var paddingCoordinates = {
            nw: { x: parent.position().x + 20, y: parent.position().y + 40 },
            ne: { x: parent.position().x + parent.size().width - 20, y: parent.position().y + 40 },
            sw: { x: parent.position().x + 20, y: parent.position().y + parent.size().height - 20 },
            se: { x: parent.position().x + parent.size().width - 20, y: parent.position().y + parent.size().height - 20 }
        },
        elementCoordinates = {
            nw: { x: elements[0].position().x, y: elements[0].position().y },
            ne: { x: elements[0].position().x + elements[0].size().width, y: elements[0].position().y },
            sw: { x: elements[0].position().x, y: elements[0].position().y + elements[0].size().height },
            se: { x: elements[0].position().x + elements[0].size().width, y: elements[0].position().y + elements[0].size().height }
        },
        modelsInParentArea = ifmlModel.findModelsInArea({ x: parent.position().x, y: parent.position().y, width: parent.size().width, height: parent.size().height }),
        cloneParentSubGraph = ifmlModel.cloneSubgraph(modelsInParentArea);
        console.log(2);
        console.log(paddingCoordinates);
        console.log(cloneParentSubGraph);
        console.log(paddingCoordinates);
        console.log(elementCoordinates);
    if (!(paddingCoordinates.nw.x <= elementCoordinates.nw.x && paddingCoordinates.nw.y <= elementCoordinates.nw.y && paddingCoordinates.se.x >= elementCoordinates.se.x && paddingCoordinates.se.y >= elementCoordinates.se.y)) {
        if (paddingCoordinates.nw.x > elementCoordinates.nw.x) {
            console.log(3);
            var delta = paddingCoordinates.nw.x - elementCoordinates.nw.x;
            positionX(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].position().x - delta);
            sizeX(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].size().width + delta);
        }
        if (paddingCoordinates.ne.x < elementCoordinates.ne.x) {
            console.log(4);
            var delta = elementCoordinates.ne.x - paddingCoordinates.ne.x;
            sizeX(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].width + delta);
        }
        if (paddingCoordinates.nw.y > elementCoordinates.nw.y) {
            console.log(5);
            var delta = paddingCoordinates.nw.y - elementCoordinates.nw.y;
            positionY(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].position().y - delta);
            sizeY(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].size().height + delta);
        }
        if (paddingCoordinates.sw.y < elementCoordinates.sw.y) {
            console.log(6);
            var delta = elementCoordinates.sw.y - paddingCoordinates.sw.y;
            sizeY(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].size().height + delta);
        }
    }
    var rect = {x: elementCoordinates.nw.x - 20, y: elementCoordinates.nw.y - 20, width: elements[0].size().width + 20, height: elements[0].size().height + 20 },
        modelsInElementArea = ifmlModel.findModelsInArea(rect);
        modelsInElementArea = _.filter(modelsInElementArea, function (el) { return el.id !== parent.id && el.attributes.parent === parent.id });

    if (modelsInElementArea.length > 0) {

        if (!child) {
            var min = modelsInElementArea.length > 0 ? modelsInElementArea.reduce((min, el) => el.position().x < min ? el.position().x : min, modelsInElementArea[0].position().x) : 0,
                delta = modelsInElementArea.length > 0 ? elementCoordinates.ne.x - min + 20 : 0;

            _.forEach(elements, function (el) {
                el.position(el.position().x - delta, el.position().y);
            })

            positionX(cloneParentSubGraph, parent, elements[0].position().x - 20);
            sizeX(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].size().width + delta);
        } else {
            switch (position) {
              case 'up':
              case 'down':
                  var middle = Math.round((elementCoordinates.ne.x - elementCoordinates.nw.x)/2),
                      rightMiddle = [],
                      leftMiddle = [];

                  _.forEach(modelsInElementArea, function (el) {
                      if(el.position().x <= middle) {
                          rightMiddle.push(el);
                      } else {
                          leftMiddle.push(el);
                      }
                  });

                  var maxRightMiddle = rightMiddle.length > 0 ? rightMiddle.reduce((max, el) => (el.position().y + el.size().height) > max ? el.position().y + el.size().height : max, rightMiddle[0].position().y + rightMiddle[0].size().height) : 0,
                      minLeftMiddle = leftMiddle.length > 0 ? leftMiddle.reduce((min, el) => el.position().y < min ? el.position().y : min, leftMiddle[0].position().y) : 0,
                      deltaRightMiddle = rightMiddle.length > 0 ? maxRightMiddle - elementCoordinates.nw.x + 20 : 0,
                      deltaLeftMiddle = leftMiddle.length > 0 ? lementCoordinates.ne.x - min + 20 : 0;

                  _.forEach(rightMiddle, function (el) {
                      var delta = cloneParentSubGraph[el.id].position().x - deltaRightMiddle;
                      positionX(cloneParentSubGraph, el, delta);

                      if ((cloneParentSubGraph[parent.id].position().x + 20) > cloneParentSubGraph[el.id].position().x) {
                          var delta = cloneParentSubGraph[parent.id].position().x + 20 - cloneParentSubGraph[el.id].position().x;
                          positionX(cloneParentSubGraph, parent, cloneParentSubGraph[el.id].position().x - 20);
                          sizeX(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].size().width + delta);
                      }
                  })
                  _.forEach(leftMiddle, function (el) {
                      var delta = cloneParentSubGraph[el.id].position().x - deltaLeftMiddle;
                      positionX(cloneParentSubGraph, el, delta);

                      if ((cloneParentSubGraph[parent.id].position().x + cloneParentSubGraph[parent.id].size().width - 20) < (cloneParentSubGraph[el.id].position().x)) {
                          var delta = cloneParentSubGraph[el.id].position().x - (cloneParentSubGraph[parent.id].position().x + cloneParentSubGraph[parent.id].size().width - 20);
                          sizeX(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].size().width + delta);
                      }
                  });
                  break;

              case 'right':
              case 'left':
                  var middle = Math.round((elementCoordinates.sw.y - elementCoordinates.nw.y)/2),
                      upMiddle = [],
                      downMiddle = [];

                  _.forEach(modelsInElementArea, function (el) {
                      if(el.position().y <= middle) {
                          upMiddle.push(el);
                      } else {
                          downMiddle.push(el);
                      }
                  });
                  var maxUpMiddle = upMiddle.length > 0 ? upMiddle.reduce((max, el) => (el.position().y + el.size().height) > max ? el.position().y + el.size().height : max, upMiddle[0].position().y + upMiddle[0].size().height) : 0,
                      minDownMiddle = downMiddle.length > 0 ? downMiddle.reduce((min, el) => el.position().y < min ? el.position().y : min, downMiddle[0].position().y) : 0,
                      deltaUpMiddle = upMiddle.length > 0 ? maxUpMiddle - elementCoordinates.nw.y + 20 : 0,
                      deltaDownMiddle = downMiddle.length > 0 ? elementCoordinates.sw.y - min + 20 : 0;
                  _.forEach(upMiddle, function (el) {
                      positionY(cloneParentSubGraph, el, cloneParentSubGraph[el.id].position().y - deltaUpMiddle);

                      if (cloneParentSubGraph[el.id].position().y < (cloneParentSubGraph[parent.id].position().y + 20)) {
                          var delta = (cloneParentSubGraph[parent.id].position().y) - cloneParentSubGraph[el.id].position().y + 40;
                          positionY(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].position().y - delta);
                          sizeY(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].size().height + delta);
                      }
                  })
                  _.forEach(downMiddle, function (el) {
                      positionY(cloneParentSubGraph, el, cloneParentSubGraph[el.id].position().y + deltaDownMiddle);

                      if ((cloneParentSubGraph[parent.id].position().y + cloneParentSubGraph[parent.id].size().height - 20) < (cloneParentSubGraph[el.id].position().y)) {
                          var delta = cloneParentSubGraph[el.id].position().y - (cloneParentSubGraph[parent.id].position().y + cloneParentSubGraph[parent.id].size().height - 20);
                          sizeY(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].size().height + delta);
                      }
                  });
                  break;
            }
        }
    }

    if (parent.attributes.parent !== undefined) {
        var options = {
                name: parent.attributes.name,
                type: parent.attributes.type,
                parent: parent.attributes.parent,
                recursion: true
            };
        console.log(options);
        insertElement(options);
    } else {
        var parentExtPadding = {
            nw: { x: cloneParentSubGraph[parent.id].position().x - 20, y: cloneParentSubGraph[parent.id].position().y - 20 },
            ne: { x: cloneParentSubGraph[parent.id].position().x + cloneParentSubGraph[parent.id].width + 20, y: cloneParentSubGraph[parent.id].position().y - 20},
            sw: { x: cloneParentSubGraph[parent.id].position().x - 20, y: cloneParentSubGraph[parent.id].position().y + cloneParentSubGraph[parent.id].size().height + 20 },
            se: { x: cloneParentSubGraph[parent.id].position().x + cloneParentSubGraph[parent.id].size().width + 20, y: cloneParentSubGraph[parent.id].position().y + cloneParentSubGraph[parent.id].size().height +20 }
        };

        _.forEach(upToParent, function (el) {
            var elPadding = {
                    nw: { x: el.position().x, y: el.position().y },
                    ne: { x: el.position().x + el.size().width, y: el.position().y },
                    sw: { x: el.position().x, y: el.position().y + el.size().height },
                    se: { x: el.position().x + el.size().width, y: el.position().y + el.size().height }
                };

            if (el.sw.y > parentExtPadding.nw.y && (el.ne.x > parentExtPadding.nw.x || el.nw.x < parentExtPadding.ne.x)) {
                var delta = el.sw.y - parentExtPadding.nw.y;
                translateY(el, el.position().y - delta);
            }
        });

        _.forEach(downToParent, function (el) {
            var elPadding = {
                    nw: { x: el.position().x, y: el.position().y },
                    ne: { x: el.position().x + el.size().width, y: el.position().y },
                    sw: { x: el.position().x, y: el.position().y + el.size().height },
                    se: { x: el.position().x + el.size().width, y: el.position().y + el.size().height }
                };

            if (el.nw.y < parentExtPadding.sw.y && (el.ne.x > parentExtPadding.nw.x || el.nw.x < parentExtPadding.ne.x)) {
                var delta = parentExtPadding.sw.y - el.nw.y;
                translateY(el, el.position().y + delta);
            }
        });

        _.forEach(rightToParent, function (el) {
            var elPadding = {
                    nw: { x: el.position().x, y: el.position().y },
                    ne: { x: el.position().x + el.size().width, y: el.position().y },
                    sw: { x: el.position().x, y: el.position().y + el.size().height },
                    se: { x: el.position().x + el.size().width, y: el.position().y + el.size().height }
                };

            if (el.nw.x < parentExtPadding.ne.x && (el.nw.y < parentExtPadding.sw.y || el.sw.y > parentExtPadding.ne.y)) {
                var delta = parentExtPadding.ne.x - el.nw.x;
                translateX(el, el.position().x + delta);
            }
        });

        _.forEach(leftToParent, function (el) {
            var elPadding = {
                    nw: { x: el.position().x, y: el.position().y },
                    ne: { x: el.position().x + el.size().width, y: el.position().y },
                    sw: { x: el.position().x, y: el.position().y + el.size().height },
                    se: { x: el.position().x + el.size().width, y: el.position().y + el.size().height }
                };

            if (el.ne.x > parentExtPadding.nw.x && (el.nw.y < parentExtPadding.sw.y || el.sw.y > parentExtPadding.nw.y)) {
                var delta = parentExtPadding.ne.x - el.nw.x;
                translateX(el, el.position().x - delta);
            }
        });
    }
    await resize(parent, cloneParentSubGraph[parent.id].position(), cloneParentSubGraph[parent.id].size());

    var num = modelsInParentArea.length;

    _.forEach(modelsInParentArea, function (el) {
        translateX(el,cloneParentSubGraph[el.id].position().x);
        translateY(el,cloneParentSubGraph[el.id].position().y);
    })

    await delay(300);

    if (!recursion) {
        if(ifmlModel.getCell(idElement)) {
            if(elements[0].attributes.parent){
                var oldParent = ifmlModel.getCell(elements[0].attributes.parent);
                oldParent.unembed(elements[0]);
            }

            parent.embed(elements[0]);

            _.forEach(elements, function (element) {
                if (element.attributes.parent) {
                    var parent = ifmlModel.getCell(element.attributes.parent);
                    element.set('z',parent.attributes.z + 1);
                }

                if (element.attributes.type === 'ifml.Event') {
                    fadeIn(element,'.marker');
                } else {
                    fadeIn(element,'.ifml-element');
                }
            });

            _.forEach(links, function (link) {
                fadeIn(link,'.connection');
                fadeIn(link,'.marker-source');
                fadeIn(link,'.marker-target');
            });

            links = _.flattenDeep(links);
        } else {
            console.log('entro');
            fadeIn(elements[0],'.ifml-element');
            ifmlModel.addCell(elements[0]);
            parent.embed(elements[0]);
        }
    }
}

function positionX (subGraph,node,x) {
    subGraph[node.id].position(x, subGraph[node.id].position().y);
}

function positionY (subGraph,node,y) {
    subGraph[node.id].position(subGraph[node.id].position().x, y);
}

function sizeX (subGraph,node,width) {
    subGraph[node.id].resize(width,subGraph[node.id].size().height);
}

function sizeY (subGraph,node,height) {
    subGraph[node.id].resize(subGraph[node.id].size().width, height);
}

async function fadeIn(element, path) {
    element.attr(path + '/fill-opacity',1);
    element.attr(path + '/stroke-opacity',1);
    var opacity = 0;
    for(var i = 0; i < 5; i ++) {
        opacity += 0.2;
        element.attr(path + '/stroke-opacity',opacity);
        element.attr(path + '/fill-opacity',opacity);
        await delay(1);
    }
}

async function fadeOut(element, path) {
    element.attr(path + '/fill-opacity',0);
    element.attr(path + '/stroke-opacity',0);
    var opacity = 1;
    for(var i = 0; i < 5; i++) {
        opacity -= 0.2;
        element.attr(path + '/stroke-opacity',opacity);
        element.attr(path + '/fill-opacity',opacity);
        await delay(1);
    }
}

function translateX(element, newPos) {
    return new Promise(resolve => {
        element.transition('position/x', newPos, {
            duration: 200
        });
        setTimeout(resolve,200);
    });
}

function translateY(element, newPos) {
    return new Promise(resolve => {
        element.transition('position/y', newPos, {
            duration: 200
        });
        setTimeout(resolve,200);
    });
}

function resizeX(element, newPos, newSize) {
    return new Promise(resolve => {
        element.transition('position/x', newPos, {
            duration: 200
        });
        element.transition('size/width', newSize, {
            duration: 200
        });
        setTimeout(resolve,200);
    });
}

function resizeY(element, newPos, newSize) {
    return new Promise(resolve => {
        element.transition('position/y', newPos, {
            duration: 200
        });
        element.transition('size/height', newSize, {
            duration: 200
        });
        setTimeout(resolve,200);
    });
}

async function resize(element, newPos, newSize) {
    return new Promise(resolve => {
        resizeX(element, newPos.x, newSize.width);
        resizeY(element, newPos.y, newSize.height);
        setTimeout(resolve,500);
    });
};

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve,ms);
    });
}

function redraw(options) {
  return new Promise(resolve => {
      var element = options.element,
          parent = options.parent,
          elementCoordinates = options.elementCoordinates,
          ifmlModel = options.ifmlModel;
      if (parent.parent.size().width <= element.size().width) {
          var delta = Math.abs((parent.position().x + parent.size().width) - (elementCoordinates.nw.x + element.size().width));
          delta = (delta/10) % 2 === 0 ? delta : delta + 5;
      }
      if (parent.size().height <= element.size().height) {
          var delta = Math.abs((parent.position().y + parent.size().height) - (elementCoordinates.nw.y + element.size().height));
          delta = (delta/10) % 2 === 0 ? delta : delta + 5;
      }
      //setTimeout(resolve,100);
  });
}

function ecommerce(options) {
    var name = 'ecommerce-',
        pattern = options.pattern;

    name += _.includes(pattern,'multilevel-master-details') ? '1' : '0';
    name += _.includes(pattern,'comment-content-management-pattern') ? '1' : '0';
    name += _.includes(pattern,'favorite-content-management-pattern') ? '1' : '0';
    name += _.includes(pattern,'wizard-pattern') ? '1' : '0';

    var template = askTemplates[name].model;
    voiceAssistantModelGenerator(template);
}

function blog(options) {
    var name = 'blog-',
        pattern = options.pattern;

    name += _.includes(pattern,'multilevel-master-details') ? '1' : '0';
    name += _.includes(pattern,'personal-pages-content-management-pattern') ? '1' : '0';
    name += _.includes(pattern,'favorite-content-management-pattern') ? '1' : '0';
    name += _.includes(pattern,'comment-content-management-pattern') ? '1' : '0';

    var template = askTemplates[name].model;
    voiceAssistantModelGenerator(template);
}

function crowdsourcing (options) {
    var name = 'crowdsourcing-',
        pattern = options.pattern;

    name += _.includes(pattern,'master-policy') ? '1' : '0';
    name += _.includes(pattern,'multilevel-master-details') ? '1' : '0';

    var template = askTemplates[name].model;
    voiceAssistantModelGenerator(template);
}

function socialnetwork (options) {
    var name = 'socialnetwork-',
        pattern = options.pattern;

    name += _.includes(pattern,'comment-content-management-pattern') ? '1' : '0';
    name += _.includes(pattern,'like-content-management-pattern') ? '1' : '0';
    name += _.includes(pattern,'friends-content-management-pattern') ? '1' : '0';

    var template = askTemplates[name].model;
    voiceAssistantModelGenerator(template);
}

function voiceAssistantModelGenerator (template) {
  try {
      ifmlBoard.clearHistory();

      function boundingBox(cells) {
          var box = {
              x: {
                  min: Number.MAX_SAFE_INTEGER,
                  max: Number.MIN_SAFE_INTEGER
              },
              y: {
                  min: Number.MAX_SAFE_INTEGER,
                  max: Number.MIN_SAFE_INTEGER
              }
          };
          cells.map(function(element) {
              if(element.attributes.type == 'ifml.ViewContainer' ||
                  element.attributes.type == 'ifml.Action'){
                  if (element.attributes.position.x < box.x.min) {
                      box.x.min = element.attributes.position.x;
                  }
                  if (element.attributes.position.y < box.y.min) {
                      box.y.min = element.attributes.position.y;
                  }
                  if (element.attributes.position.x + element.attributes.size.width > box.x.max) {
                      box.x.max = element.attributes.position.x + element.attributes.size.width;
                  }
                  if (element.attributes.position.y + element.attributes.size.height > box.y.max) {
                      box.y.max = element.attributes.position.y + element.attributes.size.height;
                  }
              }
          });
          return box;
      }
      var start = new Date(),
          loaded_at = new Date();

      var boardBB = {
          x: {
              min: 0,
              max: 0
          },
          y: {
              min: 0,
              max: 0
          }
      };

      var toBeAdded = ifml.fromJSON(template),
          toBeAddedBB = boundingBox(toBeAdded);

      if (ifmlModel.attributes.cells.models.length > 0) {
          boardBB = boundingBox(ifmlModel.attributes.cells.models);
          toBeAdded = ifml.fromJSON(partialModelValidator(ifml.toJSON(ifmlModel), template));
      }

      toBeAdded = _(toBeAdded).map(function(model) {
          if (model.attributes.position) {
              model.attributes.position.x += boardBB.x.max - toBeAddedBB.x.min + 20;
              model.attributes.position.y += boardBB.y.min - toBeAddedBB.y.min;
          }
          if (model.attributes.vertices) {
              for (var i = 0; i<model.attributes.vertices.length; i++){
                  model.attributes.vertices[i].x += boardBB.x.max - toBeAddedBB.x.min + 20;
                  model.attributes.vertices[i].y += boardBB.y.min - toBeAddedBB.y.min;
              }
          }
          return model;
      }).value();

      ifmlModel.addCells(toBeAdded);
      ifmlBoard.clearHistory();

  } catch (exception) {
      console.log(exception);
      ifmlBoard.clearHistory();
      $.notify({message: 'Invalid input file!'}, {allow_dismiss: true, type: 'danger'});
      return;
  }

  ifmlBoard.zoomE();

  return false;
}
