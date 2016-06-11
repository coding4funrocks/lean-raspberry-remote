'use strict';

var url = require('url');


var Default = require('./DefaultService');


module.exports.addDevice = function addDevice (req, res, next) {
  Default.addDevice(req.swagger.params, res, next);
};

module.exports.deleteDevice = function deleteDevice (req, res, next) {
  Default.deleteDevice(req.swagger.params, res, next);
};

module.exports.findDeviceById = function findDeviceById (req, res, next) {
  Default.findDeviceById(req.swagger.params, res, next);
};

module.exports.findDevices = function findDevices (req, res, next) {
  Default.findDevices(req.swagger.params, res, next);
};

module.exports.setStateByDeviceId = function setStateByDeviceId (req, res, next) {
  Default.setStateByDeviceId(req.swagger.params, res, next);
};
