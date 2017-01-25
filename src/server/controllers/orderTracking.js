/**
 * Created by trungnguyen on 12/28/16.
 */

var properties = require('../lib/envProperties');
var db = require('../lib/dbConnection');
var paths = require('../config/config')
var restClient = require('node-rest-client').Client;
var moment = require('moment');

var rootUrl = paths.openmrsPath;
var openmrsuser =  properties.openmrsuser;
var openmrspassword = properties.openmrspassword;
var remoteSystemSetting = getSystemProperties(rootUrl);



exports.getShipmentVendors = function(req,res) {
    //connection.connect();
    //console.log('im here');
    if(true){
        db.query('SELECT * FROM shipment_vendor',function(err,rows){
            if(err) {
                res.send(err);
            }
            else {
                try {
                    res.send(rows);
                    }
                catch(e) {
                    res.send('shipment vendors not found or problem with query');
                    }
            }
         });
    }
    else
    {
        console.log("DB connection failed");
    }
//	connection.end();

};

exports.getLabVendors = function(req,res) {
    //connection.connect();
    if(true){
        db.query('SELECT * FROM lab_vendor',function(err,rows){
            if(err) {
                res.send(err);
            }
            else {
                try {
                    res.send(rows);
                }
                catch(e) {
                    res.send('lab vendors not found or problem with query');
                }
            }
        });
    }
    else
    {
        console.log("DB connection failed");
    }
//	connection.end();

}

exports.updateLabOrderStatus = function(req,res) {
    //connection.connect();
    var newLabData = req.body;
    if(true){
        db.query('update order_tracking set ?'[newLabData],function(err,rows){
            if(err) {
                res.send(err);
            }
            else {
                try {
                    res.send(rows);
                }
                catch(e) {
                    res.send('lab order not found or problem with query');
                }
            }
        });
    }
    else
    {
        console.log("DB connection failed");
    }
//	connection.end();

};

exports.addLabComment = function(req,res){
    // todo
};

exports.updateLabComment = function(req,res) {
    // todo
}


exports.getOrderTrackingDetail = function(req,res) {
    var quote = '"';
    var order_uuid = quote+req.params.orderUUID+quote;
    //console.log(order_uuid);
    if(true){
        db.query('select o.*, s.*, l.*  from order_tracking o left join shipment_vendor s on o.shiper_id = s.shipper_id left join lab_vendor l on o.lab_id = l.lab_id where openmrs_order_uuid = '+order_uuid,function(err,rows){
            if(err) {
                res.send(err);
            }
            else {
                try {
               //     console.log(rows);
                    res.send(rows);
                }
                catch(e) {
                    res.send('order tracking record not found or problem with query');
                }
            }
        });
    }
    else
    {
        console.log("DB connection failed");
    }
}



exports.createLabOrder = function(req,res) {
   //console.log(req.body);

   var labOrderData = req.body;
    console.log(labOrderData);

   var ordertypeUuid =  remoteSystemSetting.orderTypeUUID;  // lab test order type uuid
   var concept = remoteSystemSetting.CD4;  // hiv test uuid
   var orderTemplate =  {
        "type": "testorder",
        "patient": labOrderData.patient,
       // "concept": "129473AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",  // hiv test uuid,
       "concept": concept,  // hiv test uuid,
        "encounter": labOrderData.encounter, // orders must have an encounter
        "orderer"    : labOrderData.provider , // default provider uuid  need to be dynamic
        "careSetting": "6f0c9a92-6f24-11e3-af88-005056821db0", // outpatient caresetting uuid from the caresetting resource
        "specimenSource" : "blood",
        "commentToFulfiller": labOrderData.comment,
        "instructions" : labOrderData.instructions

    };

    //console.log('order template ',orderTemplate);
   // var orderTemplate = {
   //      "autoExpireDate": "string",
   //      "instructions": "string",
   //      "commentToFulfiller": "string",
   //      "orderNumber": "string",
   //      "concept": "string",
   //      "display": "string",
   //      "previousOrder": "string",
   //      "encounter": "string",
   //      "uuid": "string",
   //      "auditInfo": "string",
   //      "orderReason": "string",
   //      "careSetting": "string",
   //      "dateStopped": "string",
   //      "urgency": "string",
   //      "patient": "string",
   //      "orderer": "string",
   //      "orderReasonNonCoded": "string",
   //      "action": "string",
   //      "dateActivated": "string"
   //  }
    var options_auth = { user: openmrsuser, password: openmrspassword };
    var client = new restClient(options_auth);
    var service = 'ws/rest/v1/order';
    var urlResource = rootUrl+service;
    var args = {
        data: orderTemplate,
        headers: { "Content-Type": "application/json" }
    };
    client.post(urlResource,args,function(data,response){
       if (data.error) {
           console.log(data.error);
       }
       else {
          // create order tracking record in mysql
           var orderTrackingData = {
               openmrs_order : data.orderNumber,
               openmrs_order_uuid     : data.uuid,
               openmrs_order_link   : data.links[1].uri,
               shipper_id           : labOrderData.shipperId,
               lab_id               : labOrderData.labId,
               lab_ordered_date     : moment().format('YYYY-MM-DD HH:mm:ss'),
               specimen_id          : labOrderData.specimenId,
               specimen_name        : labOrderData.specimenName,
               specimen_uuid        : labOrderData.patient,
               lab_order_created_by : labOrderData.provider
           };
        //   console.log('mysql order data ',orderTrackingData);
           db.query('insert into order_tracking set ? ',[orderTrackingData],function(err,result){
               if(err) {
                   console.log(err);
                   res.send(err);
               }
               else {
                 //  console.log('my sql result ',result);
                   res.send(
                       {    'success':'order created',
                            'order_id': result.insertId
                       }
                   );
               }
           })
          // res.send(data);
       }
    })
};


exports.getLocalOrders = function(req,res) {

    var quote = '"';
    var specimenUuid = quote+req.params.patientUUID+quote;
    //console.log(specimenUuid);
    db.query("select o.*, s.*, l.*  from order_tracking o left join shipment_vendor s on o.shipper_id = s.shipper_id left join lab_vendor l on o.lab_id = l.lab_id where specimen_uuid = "+specimenUuid,function(err,rows){
        if(err) {
            res.send(err);
        }
        else {
            try {
             //   console.log(rows);
                res.send(rows);
            }
            catch(e) {
                res.send('order tracking records not found or problem with query');
            }
        }
    })
};

exports.updateLabOrderResults = function(req,res) {
    var labResultData = req.body.labResultData;
    var quote = '"';
    var openmrs_order = quote+req.body.openmrs_order+quote;
    var openmrs_order_uuid = quote+req.body.openmrs_order_uuid+quote;

    labResultData.specimen_collection_date = moment(labResultData.specimen_collection_date).format('YYYY-MM-DD HH:mm:ss');
    labResultData.lab_processed_date = moment(labResultData.lab_processed_date).format('YYYY-MM-DD HH:mm:ss');
    labResultData.lab_returned_date = moment().format('YYYY-MM-DD HH:mm:ss');
    // create / update observation with the result
    var options_auth = { user: openmrsuser, password: openmrspassword };
    var client = new restClient(options_auth);
    var service = 'ws/rest/v1/order';
    var urlResource = rootUrl+service;
    db.query("update order_tracking set ? where openmrs_order = "+openmrs_order,[labResultData],function(err,result) {
        if(err) {
            console.log(err);
            res.send(err);

        }
        else {
            try {
            //    console.log('update order result ',result);
                res.send(
                    {    'success':'result updated',
                    }
                );
            }
            catch(e) {
                res.send('problem with query');
            }
        }
    })
};

exports.signResults = function(req,res) {
    var quote = '"';
    var openmrs_order = quote+req.body.openmrs_order+quote;
    var labResultData = {
        result_observation_date : moment().format('YYYY-MM-DD HH:mm:ss'),
        result_reviewed_by      : req.body.reviewed_by,
        result_reviewed_by_uuid : req.body.reviewed_by_uuid
    }

    db.query("update order_tracking set ? where openmrs_order = "+ openmrs_order,[labResultData],function(err,result) {
        if(err) {
            console.log(err);
            res.send(err);

        }
        else {
          //  console.log('sql result ',result);
            res.send(
                {
                    'success': 'result signed'
                }
            );
        }
    })
};

exports.getOutstandingOrders = function(req,res) {
    db.query("select * from order_tracking where result_observation_date is null",function(err,rows) {
        if(err) {
            console.log(err);
            res.send(err);

        }
        else {
            //  console.log('sql result ',result);
            res.send(rows);
        }
    })
}

exports.getSession = function(req,res) {
    console.log('i was in get session');
    var client = new restClient();
    var rootUrl = paths.openMrsPath;
    var service = 'ws/rest/v1/session';
    var urlResource = rootUrl+service;
    console.log(urlResource);
    client.get(urlResource, function(data,response){
        console.log(data);
        // raw response
     //   console.log(response);
        res.send(data);
    })


};

function getSystemProperties(systemName) {
    var foundSystem = null;
    var defaultSystem = null;
    properties.openmrs_systems.forEach(function(system) {
        if (system.systemId == systemName) {
            foundSystem = system;
        }
        if (system.systemId == 'default') {
            defaultSystem = system;

        }
    });
    if (foundSystem === undefined) {
        foundSystem = defaultSystem;
        console.log('using default system');
    }
    return foundSystem;
}