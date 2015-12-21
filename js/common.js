Zepto(function($){
	$(".dl_list").on("touchstart", function(){
		$(this).addClass("active");
	});
	$(".dl_list").on("touchend", function(){
		$(this).removeClass("active");
	});
	$(".dl_list").on("touchcancel", function(){
		$(this).removeClass("active");
	});

    //回到顶部
    var backTop = $(".gototop");
    backTop.bind("click", function (e) {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        return false;
    });

    $(document).bind("scroll", function () {
        var top = document.body.scrollTop || document.documentElement.scrollTop;
        if (top > $(window).height()){
            if($(".bottom_khdxz").hasClass("dn")){
                backTop.css({"bottom":"40px"});
            }else{
                backTop.css({"bottom":"100px"});
            }
            backTop.show();
        }
        else{
            backTop.hide();
        }
    });

    //下拉菜单
	$(".droplist-box>span").on('tap', function(){
		var self = $(this);
		if(self.find("span").hasClass("icon-arrow-fill-up")){
			self.removeClass("gc-yellow");
			self.find("span").removeClass("icon-arrow-fill-up").addClass("icon-arrow-fill-down");
			$(".droplist-box ul").hide();
			$(".layer-overall").hide();
		} else if(self.find("span").hasClass("icon-arrow-fill-down")){
			self.siblings("span").removeClass("gc-yellow").find("span").removeClass("icon-arrow-fill-up").addClass("icon-arrow-fill-down");
			self.addClass("gc-yellow");
			self.find("span").removeClass("icon-arrow-fill-down").addClass("icon-arrow-fill-up");		
			$(".droplist-box ul").hide();
			$(".droplist-box>ul").eq($(".droplist-box>span").index(self)).show();
			$(".layer-overall").css({"min-height":$("body").height()-90}).show();
		}
	});
	

	$("#area>li>a").bind("tap", function(e){
		$("#area>li ul").hide();
		$("#area>li.active").removeClass('active');
		$(this).siblings("ul").show();
		$(this).parent().addClass('active');
		e.preventDefault();	
	});
	$("#area>li>a").bind("click", function(e){
		if($(this).attr("data-direct") == "true"){
			
		} else {
			e.preventDefault();
		}
	});

    //显示更多
	$(".comment-content .more-toggle").on('tap', function(){
		$(this).parent().hide();
		$(this).parent().siblings(".comment-content").show();
	});

    $.cookie = function (key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && String(value) !== "[object Object]")
        {
            options = $.extend({}, options);

            if (value === null || value === undefined)
            {
                options.expires = -1;
            }

            if (typeof options.expires === 'number')
            {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key),
                '=',
                options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    };
    //底部悬浮
    if($(".bottom_khdxz").length > 0){
        if ($.cookie('bottom_khdxz') == null){
            $(".bottom_khdxz").removeClass("dn");
        }
        $(".bottom_khdxz_close").on("click", function () {
            $(".bottom_khdxz").addClass("dn");
            $(".gototop").css({"bottom":"40px"});
            $.cookie('bottom_khdxz', 1, {'expires': 1, 'path': '/'});
            return false;
        });
    }

    var count = 60,
        timeInterval;
    $(".submit_code").on('click', function(){
        if(count != 60){
            return;
        }
        var self = $(this);
        var phone = $(".phone").val();
        if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(phone))){
            $('.bind-success').text('请输入正确的手机号').show();
        } else{
            //self.text("60秒后再次发送请求");
            timeInterval = setInterval(function(){
                count--;
                if(count == 0){
                    clearInterval(timeInterval);
                    self.text("发送验证码");
                    count = 60;
                }else{
                    self.text(count + "秒后重发");
                }
            },1000);

            $.ajax({
                type: "POST",
                url: "/api/mobile/sendCaptcha",
                dataType: "json",
                data: {'phone':phone},
                success: function (result) {
                    getCodeCallBack(result);
                }
            });
        }
    });

    function getCodeCallBack(result){
        var yzmCode = $(".submit_code");
        if(!result.status){
            yzmCode.text("发送验证码");
            $('.bind-success').text(result.msg).show();
            clearInterval(timeInterval);
        }else{
            $('.bind-success').text(result.msg).show();
        }
    }

    //绑定手机的验证按钮
    $('.confirm_payment').on('click', function(){
        if($('input[name="phone"]').val()==''){
            $('.bind-success').text('手机号不能为空').show();
            return false;
        }else if($('input[name="captcha"]').val()==''){
            $('.bind-success').text('验证码不能为空').show();
            return false;
        }
    });
	
    //登录的验证按钮
    $('.login_btn').on('click', function(){
        if($('input[type="text"]').val()==''){
            $('.bind-success').text('请填写用户名').show();
            return false;
        }else if($('input[type="password"]').val()==''){
            $('.bind-success').text('请填写密码').show();
            return false;
        }
    });

});