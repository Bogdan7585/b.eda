'use strict';

exports.config = {
	env: 'development',
	name: 'orders',
	listen: {
		host: '192.168.68.118',
		port: 8002
	},
	db: {
		path: './data/users.nedb'
	},
	services:{
		users:{
			host: "192.168.68.110",
			port:8002,
			path:"/api"
		},
		products:{
			host: "192.168.68.110",
			port:8002,
			path:"/api"
		}
	},
	serviceRegistry:{
			host: "127.0.0.1",
			port: 8500
		}
};
