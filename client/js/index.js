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
    ifml2code = require('./ifml2code').ifml2code,
    createIFBrowser = require('./ifbrowser').IFBrowser,
    createIFClient = require('./ifclient').IFClient,
    AException = require('almost').Exception,
    patternIdValidator = require('./idValidator').idValidator;

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

function showElementStatistics(cellView) {
    createModalStatistics({cell: cellView.model});
}

ifmlBoard.on('cell:edit cell:pointerdblclick link:options', editIfmlElement);
statisticsBoard.on('cell:statistics cell:pointerdblclick link:options', showElementStatistics);
pcnBoard.on('cell:edit cell:pointerdblclick', editPcnElement);

var loaded_at = new Date();

$('#ifml > .sidebar .png-download').click(function () {
    ifmlBoard.download();
    return false;
});

$('#ifml > .sidebar .model-download').click(function () {
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

$('#ifml > .sidebar .model-load').click(function () {
    $('#ifml > .load > input[type=file]').click();
    return false;
});

$('#ifml > .append > input[type=file]').change(function () {
    var reader = new FileReader();

    reader.onload = function (e) {

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

        try {
            var start = new Date();

            loaded_at = new Date();

            if (ifmlModel.attributes.cells.models.length == 0) {
                $.notify({message: 'The board is empty, please use Load Model!'}, {allow_dismiss: true, type: 'warning'});
                return;
            }
            
            var toBeAdded = ifml.fromJSON(JSON.parse(e.target.result)),
                boardBB = boundingBox(ifmlModel.attributes.cells.models),
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

$('#ifml > .sidebar .model-append').click(function () {
    $('#ifml > .append > input[type=file]').click();
    return false;
});

$('#ifml > .sidebar .modal-example').click(function () {
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

$('#ifml > .sidebar .modal-pattern').click(function () {
    createModalPatterns({patterns: patterns, load: function (pattern) {}});
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
