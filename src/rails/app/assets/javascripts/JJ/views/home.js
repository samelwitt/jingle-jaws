goog.provide("JJ.views.home");
goog.exportSymbol("JJ.views.home.Index");

goog.require('JJ.managers.SocketManager');

/**
 * @constructor
 */
JJ.views.home.Index = function() {
	this.bindControls();
};

// define our prototypes
JJ.views.home.Index.prototype = {
	bindControls: function() {
		var self = this;
		$('#requestControl').click(function() {
			self.registerSocketListeners();

			var socketManager = new jj.managers.SocketManager();
		});
	},

	registerSocketListeners: function() {
		this.socket = io.connect('http://dev.jinglejaws.net:1225');

		// TODO: Handle reset if already connected

		this.socket.on('requested', this.onRequested);
		this.socket.on('queued', this.onQueued);
		this.socket.on('activated', this.onActivated);
		this.socket.on('active', this.onActive);
		this.socket.on('expired', this.onExpired);
	},

	onRequested: function (data) {
		if (data.requested) {
			$('#queued').fadeIn();
		}
	},

	onQueued: function(data) {
		$('#queueLength').html(data.queueLength);
		$('#queueTimeRemaining').html(Math.round(data.remainingWaitTime/1000));
	},

	onActivated: function(data) {
		if (data.active) {
			console.log('CHOMP! CHOMP!');
			$('#queued').fadeOut(function() {
				$('#activated').fadeIn();
			});
		}
	},

	onActive: function(data) {
		$('#active').html(Math.round(data.remainingActiveTime/1000));
	},

	onExpired: function(data) {
		if (data.expired) {
			$('#activated').fadeOut(function() {
				$('#expired').fadeIn();
			});
		}
	}
};