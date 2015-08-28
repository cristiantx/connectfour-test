var Marionette = require('backbone.marionette'),
	template = require('../templates/modal.ejs'),
	_ = require('underscore'),
	$ = require('jquery'),
	Radio = require('backbone.radio');

require('bootstrap');

module.exports = Marionette.Region.extend({
	el: '#modal-container',
	template: template,
	events: {
    		'click .btn-close': 'onCloseClick'
   	},	
	constructor: function() {
		this.lastHeight = 20000; 
		this.body = $('body');

		Marionette.Region.prototype.constructor.apply(this, arguments);
		this.channel = Radio.channel('modal');


		this.channel.comply({
			'close'	: _.bind( this.close, this )
		});

	},

	attachHtml: function( view ) {

		var self = this; 

		this.$el.empty().append( this.template() );
		this._ensureElement();

		this.$el.find('.modal-dialog').attr('class', 'modal-dialog');

		if( view.getParentClassName ) {
			this.$el.find('.modal-dialog').addClass( view.getParentClassName() );
		}



		this.$el.find('.modal-content').append(view.el);

		this.$el.find('.modal-left-arrow').on("click", function(){
			self.onPrevious(); 
		}); 

		this.$el.find('.modal-right-arrow').on("click", function(){
			self.onNext(); 
		}); 

		this.$el.find('.btn-close').on("click", function(){
			self.onCloseClick(); 
		}); 

		this.$el.on('hidden.bs.modal', function () {
			self.onCloseClick(); 
		}); 

		//this.disableScrolling(); 


	},

    disableScrolling: function() {
        this.lastHeight = $("body").height(); 
        $('html').css({
            'overflow': 'hidden',
            'height': '100%'
        });
        $('body').css({
            'overflow': 'hidden',
            'height': '100%'
        });            
    }, 

    enableScrolling: function() {
        // Scrolling is disabled for iPad 
        if (NATIVE_IPAD) {
            return; 
        }
        $('html').css({
            'overflow': 'auto',
            'height': '100%'
        }); 
        $('body').css({
            'overflow': 'auto',
            'height': this.lastHeight + 'px'
        }); 
    }, 	

	onRender: function() {

	},

	onPrevious: function(event) {
		Radio.command('modal', 'previous' );
	}, 

	onNext: function(event) {
		Radio.command('modal', 'next' );
	}, 

	onShow: function() {



		this.$el.modal('show');
		this.body.addClass('modal-in');
	//	$('.modal-backdrop').css('backgroundColor', this.currentView.$el.css('backgroundColor') ).css('opacity', 1);

		this.$el.on('hidden.bs.modal', { region: this }, _.bind( function(event) {
			this.channel.trigger('before:close');
			event.data.region.empty();
		}, this ));
	},

	onEmpty: function( view ) {

		view.destroy();
		this.$el.modal('hide');
	},

	onCloseClick: function() {
		this.close(); 
	}, 

	close: function() {
		if( this.currentView ) this.currentView.destroy();
		this.body.removeClass('modal-in');
		this.$el.modal('hide');
		//this.enableScrolling(); 
	}
});