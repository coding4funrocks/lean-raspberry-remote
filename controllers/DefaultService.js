'use strict';

var net = require('net');

// Using the Module Pattern
var powerOutlet = (function () {
    
    // Private method
    var _setState = function (ipAddress, remotePort, stateVal) {
        var success = false;
        var socket = net.connect(remotePort, ipAddress, function () {
            socket.write(stateVal);
            success = true;
        });

        socket.on('error', function (err) {
            console.log("Error: " + err);
        });

        socket.end();
        return success;
    };

    return {
        
        on: function (ipAddress, remotePort) {
            return _setState(ipAddress, remotePort, '10001021');
        },
        
        off: function (ipAddress, remotePort) {
            return _setState(ipAddress, remotePort, '10001020');
        }
    };
 
})();

var loki = require('lokijs');
var db = new loki('devices.json');
var devices = db.addCollection('devices', { uniqueIndices: ['id'] });

exports.addDevice = function (args, res, next) {
    /**
    * parameters expected in the args:
    * device (NewDevice)
    **/

    var device = args.device.value;
    var newDevice = devices.insert(device);
    newDevice.id = newDevice.$loki;
    newDevice.state = false;
    devices.ensureUniqueIndex('id');
    db.saveDatabase();
    
    if(newDevice != null) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(newDevice));
      }
      else {
        res.end();
      }  
}

exports.deleteDevice = function(args, res, next) {
    /**
    * parameters expected in the args:
    * id (Long)
    **/
    // no response value expected for this operation
    for (var i = 0; i < devices.data.length; i++) {
        if (devices.data[i]["id"] == args.id.value) {
            devices.remove(devices.data[i]);
        }
    }
    
    if (Object.keys(devices).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(devices.data));
    }
    else {
        res.end();
    } 
}

exports.findDeviceById = function(args, res, next) {
    /**
    * parameters expected in the args:
    * id (Long)
    **/
    var device = { };
    for (var i = 0; i < devices.data.length; i++) {
        if (devices.data[i]["id"] == args.id.value) {
            devices.remove(devices.data[i]);
        }
    }

    if(device != null) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(device));
    }
    else {
        res.end();
    }  
}

exports.findDevices = function(args, res, next) {
  /**
   * parameters expected in the args:
  * limit (Integer)
  **/

  if(devices.data.length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(devices.data));
  }
  else {
    res.end();
  }
  
}

exports.setStateByDeviceId = function(args, res, next) {
    /**
    * parameters expected in the args:
    * id (Long)
    * state (Boolean)
    **/

    var success = false;
    for (var i = 0; i < devices.data.length; i++) {
        var currentDevice = devices.data[i];

        if (currentDevice.id == args.id.value) {
            var state = args.state.value;
            var oldState = currentDevice.state;
            var ipAddress = currentDevice.ipAddress;
            var remotePort = currentDevice.remotePort;

            if (state) {
                success = powerOutlet.on(ipAddress, remotePort);
            }
            else {
                success = powerOutlet.off(ipAddress, remotePort);
            }  
            
            if (success) {
                currentDevice.state = state;
                currentDevice.error = false;
                currentDevice.success = true;
            }
            else {
                currentDevice.state = oldState;
                currentDevice.error = true;
                currentDevice.success = false;
            }
        }
    }
    
    if (Object.keys(devices).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(devices.data));
    }
    else {
        res.end();
    }  
}

