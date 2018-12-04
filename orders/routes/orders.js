'use strict';

var async = require('async');
var got = require('got');
var db = require('../db').db;
var errors = require('../utils/errors');
var validate = require('../utils/validate').validate;
var config = require('../config').get();


var idScheme = {
	type: 'object',
	properties: {
		_id: {
			type: 'string'
		}
	},
	required: ['_id'],
	additionalProperties: false
};

var orderScheme = {
  type: 'object',
  properties: {
    _id: {
      type: 'number'
    },
    createDate: {
      type: "number"
    },
    userId: {
      type: "number"
    },
    productIds: {
      type: "array",
      items: 
        {
          type: "object",
          properties: {
            productId: {
              type: "number"
            },
            price: {
              type: "number"
            },
            quantity: {
              type: "number"
            }
          },
          required: [
            "productId",
            "price",
            "quantity"
          ]
        }
    },
    address: {
      type: "object",
      properties: {
        country: {
          type: "object",
          properties: {
            title: {
              type: "string"
            },
            fiasId: {
              type: "string"
            }
          },
          required: [
            "title",
            "fiasId"
          ]
        },
        regions: {
          type: "object",
          properties: {
            title: {
              type: "string"
            },
            fiasId: {
              type: "string"
            },
            type: {
              type: "string"
            }
          },
          required: [
            "title",
            "fiasId",
            "type"
          ]
        },
        city: {
          type: "object",
          properties: {
            title: {
              type: "string"
            },
            fiasId: {
              type: "string"
            },
            type: {
              type: "string"
            }
          },
          required: [
            "title",
            "fiasId",
            "type"
          ]
        },
        street: {
          type: "object",
          properties: {
            title: {
              type: "string"
            },
            fiasId: {
              type: "string"
            },
            type: {
              type: "string"
            }
          },
          required: [
            "title",
            "fiasId",
            "type"
          ]
        },
        house: {
          type: "object",
          properties: {
            number: {
              type: "string"
            },
            type: {
              type: "string"
            }
          },
          required: [
            "number",
            "type"
          ]
        },
        block: {
          "type": "string"
        },
        flat: {
          type: "number"
        }
      },
      required: [
        "country",
        "regions",
        "city",
        "street",
        "house"
      ]
    },
    deliveryDate: {
      type: 'number'
    },
    totalPrice: {
      type: 'number'
    }
  },
  required: [
    '_id',
    'createDate',
    'userId',
   /* 'productIds',
    'address',
    'deliveryDate',
    'totalPrice'*/
  ]
};

module.exports = function(app) {
	app.get('/api/orders/:_id', function(req, res, next) {
		var params = req.params;

		async.waterfall([
			function(callback) {
				validate(idScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
				db.findOne({_id: params._id}, callback);
			},
			function(order, callback) {
				got(
				{
					hostname: config.services.users.host,
					port: config.services.users.port,
					path: config.services.users.path + '/users/' + order.userId
				},
				{
					method: 'get',
					json: true
				},
				callback
				)
			},
			function(user, callback) {
				console.log(user)
				// if (!order) {
				// 	return callback(new errors.NotFoundError(
				// 		'Order not found: _id = ' + params._id
				// 	));
				// }

				// res.json({
				// 	data: order
				// });
			}
		], next);
	});

	app.get('/api/orders', function(req, res, next) {
		async.waterfall([
			function(callback) {
				var query = req.query || {};

				validate({
					type: 'object',
					properties: {
						offset: {
							type: 'integer',
							minimum: 0
						},
						limit: {
							type: 'integer',
							minimum: 0,
							maximum: 100,
							default: 20
						},
						title: {
							type: 'string'
						}
					},
					additionalProperties: false
				}, query, callback);
			},
			function(query, callback) {
				var condition = {};
				if (query.title) {
					condition.title = {
						$regex: new RegExp(query.title)
					};
				}

				var cursor = db.find(condition)
					.skip(query.offset)
					.limit(query.limit);

				cursor.exec(callback);
			},
			function(orders, callback) {
				res.json({
					data: order
				});
			}
		], next);
	});

	app.post('/api/orders', function(req, res, next) {
		async.waterfall([
			function(callback) {
				var data = req.body;
				validate(orderScheme, data, callback);
			},
			function(data, callback) {
				db.insert(data, callback);
			},
			function(order, callback) {
				res.json({
					data: orders
				});
			}
		], next);
	});

	app.put('/api/orders/:_id', function(req, res, next) {
		var params = req.params;
		var data = req.body;
		console.log(params, data)

		async.waterfall([
			function(callback) {
				validate(idScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
				validate(orderScheme, data, callback);
			},
			function(validatedData, callback) {
				data = validatedData;
				db.findOne({_id: params._id}, callback);
			},
			function(order, callback) {
				if (!order) {
					return callback(new errors.NotFoundError(
						'Order not found: _id = ' + params._id
					));
				}

				db.update(
					{_id: params._id},
					data,
					{returnUpdatedDocs: true},
					callback
				);
			},
			function(order, callback) {
				res.json({
					data: oder
				});
			}
		], next);
	});

	app['delete']('/api/orders/:_id', function(req, res, next) {
		var params = req.params;

		async.waterfall([
			function(callback) {
				validate(idScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
				db.findOne({_id: params._id}, callback);
			},
			function(order, callback) {
				if (!order) {
					return callback(new errors.NotFoundError(
						'Order not found: _id = ' + params._id
					));
				}

				db.remove({_id: params.id}, {}, callback);
			},
			function(order) {
				res.json({
					data: order
				});
			}
		], next);
	});
};
