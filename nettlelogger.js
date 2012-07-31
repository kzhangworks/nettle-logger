var http = require('http'),
  urllib = require('url'),
  log4js = require('log4js');

exports.getLogger = function(level,category, type)
{
	if( type == 'development') {
		log4js.restoreConsole();
		log4js.clearAppenders();
		log4js.loadAppender('file');
		log4js.addAppender(log4js.appenders.file('nettle.log'), category);
		var logger = log4js.getLogger(category);
		logger.setLevel(level);
	    return logger;		
	} else {
		return null;
	}
};

exports.log = function(sysLogLevel, appid, message, level) {
	if( false ){
		if( level == 'OFF') {
			return;
		}else if( level == 'FATAL') {
			filelogger.fatal( message );
		} else if ( level == 'ERROR') {
			filelogger.error( message );
		} else if ( level == 'WARN') {
			filelogger.warn( message );
		} else if ( level == 'INFO') {
			filelogger.info( message );
		} else if ( level == 'DEBUG') {
			filelogger.debug( message );
		} else if ( level == 'TRACE') {
			filelogger.trace( message );
		} else if ( level == 'ALL') {
			filelogger.all( message );
		}	
	} else {
		logToDB(sysLogLevel, appid, message, level);
	}
};

function logToDB(sysLogLevel, appid, message, level)
{
	var globalConfig = u.getGlobalConfig(),
	host = globalConfig.publishHost || 'admin.cloudservices.appcelerator.com',
	port = globalConfig.publishPort || 80;
    var url = 'http://' + host + ':' +
			   port + '/log/'+ sysLogLevel + '/' + appid + '/' + message + '/' + level;
	var opts = urllib.parse(url);
	opts.method = 'POST';
	opts.headers = {'Content-Type':'application/json'}; 
	var req = http.request(opts, function(res)
	{
		if (res.statusCode != 200)
		{
			console.log("Fail to write log to db through status server. response code: "+res.statusCode);
		}
	})
	.on('error', function(e)
	{
		console.log('Server returned error: '+e.message);
	});

	req.end();
};