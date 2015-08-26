/** @module is24 */
var oauth = require('oauth');
var qs = require('qs');
var IS24 = function(options) {
    if (!(this instanceof IS24)) return new IS24(options);
    this.consumerKey = options.consumerKey;
    this.consumerSecret = options.consumerSecret;
    this.accessToken = options.accessToken;
    this.tokenSecret = options.tokenSecret;
    this.customHeaders = options.customHeaders || {"Accept" : "application/json"};
    this.baseUrl = "https://rest.sandbox-immobilienscout24.de/restapi/api/offer/v1.0/user/me";
    this.oa = new oauth.OAuth(
        "https://rest.sandbox-immobilienscout24.de/restapi/security/oauth/request_token",
        "https://rest.sandbox-immobilienscout24.de/restapi/security/oauth/access_token", 
        this.consumerKey, 
        this.consumerSecret, 
        "1.0", 
        this.callback, 
        "HMAC-SHA1", 
        null, 
        this.customHeaders
    );
    return this;
};

/**
 * Get a realestate by id
 * @method getARealestate
 * @param {number} id - the id 
 * @param {requestCallback} cb - the callback that handles the response.
 */
IS24.prototype.getARealestate = function(id, cb) {
  var path = '/realestate';
  var url = this.baseUrl + path;
  this.doRequest(url, id, function(err, data, res) {
      if (err) {
          cb(err, data, res, this.baseUrl+'/realestate');
      } else {
          try {
              cb(null, data, res);
          } catch (e) {
              cb(e, data, res);
          }
      }
  });
};

/**
 * Get all realestate
 * @method getAllRealestate
 * @param {requestCallback} cb - the callback that handles the response.
 */
IS24.prototype.getAllRealestate = function(cb) {
    var path = '/realestate';
    var url = this.baseUrl + path;
    this.doRequest(url, null, function(err, data, res) {
        if (err) {
            cb(err, data, res, this.baseUrl+'/realestate');
        } else {
            try {
                cb(null, data, res);
            } catch (e) {
                cb(e, data, res);
            }   
        }   
    }); 
};

/**
 * Post a realestate
 * @method postARealestate
 * @param {object} realestate - the realestate object
 * @param {requestCallback} cb - the callback that handles the response
 */
IS24.prototype.postARealestate = function(realestate, cb) {
    var path = '/realestate';
    var url = this.baseUrl + path;
    this.doPost(url, realestate, function(err, data, res) {
        if (err) {
            cb(err, data, res, this.baseUrl+'/realestate');
        } else { 
            try {
                cb(null, data, res);
            } catch (e) {
                cb(e, data, res);
            }   
        }
    });
};

/**
 * Do post
 * @method doPost
 * @param {string} url - the url
 * @param {string} body - the realestate object
 * @param {requestCallback} cb - the callback that handles the response
 */
IS24.prototype.doPost = function(url, body, cb) {
    // Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
    // From https://github.com/ttezel/twit/blob/master/lib/oarequest.js
    url = url.replace(/\!/g, "%21")
        .replace(/\'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");
    this.oa.post(url, this.accessToken, this.tokenSecret, body, "application/xml", function(err, data, res) {
        if (!err && res.statusCode == 200) {
            cb(null, data, res);
        } else {
            cb(err, data, res);
        }
    });

};

/**
 * Do request
 * @method doRequest
 * @param {string} url - the url
 * @param {object} params - the params
 * @param {requestCallback} cb - the callback that handles the response
 */
IS24.prototype.doRequest = function(url, params, cb) {
    var url = url + this.buildQS(params);
    // Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
    // From https://github.com/ttezel/twit/blob/master/lib/oarequest.js
    url = url.replace(/\!/g, "%21")
        .replace(/\'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");
    this.oa.get(url, this.accessToken, this.tokenSecret, function(err, data, res) {
        if (!err && res.statusCode == 200) {
            cb(null, data, res);
        } else {
            cb(err, data, res);
        }
    });
};

IS24.prototype.buildQS = function (params) {
    if (params && Object.keys(params).length > 0) {
        return '/'+qs.stringify(params, { delimiter: '/', strictNullHandling: true });
    }
    return '';
};
module.exports = IS24;
