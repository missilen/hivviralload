//LOCAL
module.exports = {
    MONGO_DOMAIN: 'mongodb://localhost:27017/commsphere',
    mysqlhost: '127.0.0.1',
    mysqluser: 'iiuopenmrs',
    mysqlpassword: 'OpenMRSWiz1!',
    mysqldatabase: 'hiv_lab_track',
    imagePath : '/ec2/hivlabtrack',
    USESSL : 'false',
    SSL_CERT:  './server/utilities/cert.pem',
    SSL_KEY:  './server/utilities/key.pem',
    SSL_BUNDLE: './server/utilities/gd_bundle-g2.crt',
    openmrsuser : 'Admin',
    openmrspassword : 'Admin123',
    openmrs_systems  :[
        {
            systemId        : "http://lvsopenmrs2.lab.local:8081/openmrs-standalone/",
            hivCohortUUID   : "95e6dbeb-6701-4b4f-a400-2f8896203656",
            CD4             :   "aad90629-06b7-4654-a091-594e63e739a4" , // cd4 count concept
            orderTypeUUID   :"52a447d3-a64a-11e3-9aeb-50e549534c5e"
        },
        {
            systemId        : "http://localhost:8081/openmrs-standalone/",
            hivCohortUUID   : '1b1b0ffb-0d6e-4a6a-94c6-afde774a5758',  // this cohort return list of hiv patient
            CD4             : "ad38443c-b289-4e06-ac32-05d4745e9b71",  // cd4 count concept
            orderTypeUUID   :  "52a447d3-a64a-11e3-9aeb-50e549534c5e"  // order type of "TEST"
        }
    ]


};
