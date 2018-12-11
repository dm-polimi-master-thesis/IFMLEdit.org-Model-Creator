// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    fieldsManipulator = {};

function toRegularValues (fields) {
  return _.filter(fields, function (f) {
              return f.type !== 'radio' && f.type !== 'checkbox' && f.type !== 'hidden' && f.type !== 'hidden-object';
           })
}

function toSpecialValues (fields) {
  return _.chain(fields)
          .filter(function (f) {
              return f.type === 'radio' || f.type === 'checkbox' || f.type === 'hidden' || f.type === 'hidden-object';
           })
          .map(function (f) {
              return (f.type === 'hidden' || f.type === 'hidden-object') ? f.label : f.name ;
           })
          .uniq()
          .map(function (f) {
              return { label: f };
           })
          .value()
}

function toErrorValues (fields) {
  return _.map(fields, function (f) {
              return { label: f.label + '-error' };
           });
}

fieldsManipulator.toRegularValues = toRegularValues;
fieldsManipulator.toSpecialValues = toSpecialValues;
fieldsManipulator.toErrorValues = toErrorValues;

exports.fieldsManipulator = fieldsManipulator;
