(function($){
	var Tab = function(tab){
		var _this = this;
		this.tab = tab;
		this.config = {
			"triggerType":"mouseover",
			"effect":"default",
			"invoke":1,
			"auto":false
		};
		Object.assign(_this.config,_this.getConfig());

		this.navItems = $(this.tab).find('.tab-nav li');
		this.contentItems = $(this.tab).find('.content-wrap .content-item');
		
		// 执行事件
		function action(e){
			_this.invoke($(this).index());
		}
		// 根据事件类型绑定不同监听器上绑定事件
		switch(this.config.triggerType){
			case 'click':
				this.navItems.on('click',action);
				break;
			case 'mouseover':
			default:
				this.navItems.on('mouseover',action);
		}

		if(this.config.auto){
			this.timer = null;
			this.loop = 0;
			this.autoPlay();
			$(this.tab).hover(function(){
				clearInterval(_this.timer);
			},function(){
				_this.autoPlay();
			});
		}
		if(this.config.invoke&&(!isNaN(this.config.invoke))){
			this.invoke(this.config.invoke-1);
		}
	};

	Tab.prototype = {
		autoPlay:function(){
			var _this = this;
			var length = this.navItems.length;
			_this.timer = setInterval(function() {
				_this.loop = (_this.loop+1)%length;
				_this.invoke(_this.loop);
			}, _this.config.auto);
		},
		getConfig:function(){
			var dataConfig = this.tab.getAttribute("data-config");
			return dataConfig?JSON.parse(dataConfig):null;
		},
		invoke:function(index){
			if(this.config.auto){
				this.loop = index;
			}
			var activedNavItem = this.navItems.eq(index);
			var currentContent = this.contentItems.eq(index);
			activedNavItem.addClass('actived').siblings().removeClass('actived');
			switch(this.config.effect){
				case 'fade':
					currentContent.fadeIn().siblings().fadeOut();
					break;
				case 'default':
				default:
					currentContent.addClass('current').siblings().removeClass('current');
			}
		}
	};

	window.Tab = Tab;
	$.fn.extend({
		tab:function(){
			this.each(function(){
				new Tab(this);
			});
			return this;
		}
	});
})(jQuery);