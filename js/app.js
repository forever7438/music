var server = "https://test.cnsunrun.com/mokaodashi/";

(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (!checkMobil(loginInfo.account)) {
			return callback('请输入正确手机号码');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6  个字符');
		}
		mui.ajax({
			url: server + 'Api/V1/login/index',
			type: 'POST',
			data: {
				mobile: loginInfo.account,
				password: loginInfo.password
			},
			dataType: 'json', //服务器返回json格式数据
			success: function(data) {
				plus.nativeUI.closeWaiting();
				// console.log("login:"+JSON.stringify(data))
				if (data.status == 1) {
					//	console.log("login:"+JSON.stringify(data))
					return owner.createState(data.info.nickname, data.info.realname, data.info.user_key, data.info.mobile, data.info
						.member_id, data.info.subject_pid, data.info.subject_id, data.info.subject_title, callback);
				} else {
					return callback(data.msg);
				}
			},
			error: function(xhr, type, errorThrown) {
				//          	console.log(xhr.responseText)

				plus.nativeUI.closeWaiting();
				mui.toast("请检查网络设置");
				// authed = false;
			}
		});

	};

	owner.createState = function(nickname, realname, user_key, mobile, member_id, subject_pid, subject_id, subject_title,
		callback) {
		var state = owner.getState();
		state.nickname = nickname;
		state.realname = realname;
		state.user_key = user_key;
		state.mobile = mobile;
		state.member_id = member_id;
		state.subject_pid = subject_pid;
		state.subject_id = subject_id;
		state.subject_title = subject_title;
		//		state.token = token;
		//		state.token_type = token_type;
		//		state.expires_in = state.expires_in;
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {

		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		regInfo.code = regInfo.code || '';
		
		regInfo.open_id = regInfo.open_id || '';
		regInfo.open_type = regInfo.open_type || '';
		regInfo.nickname = regInfo.nickname || '';
		regInfo.headimg = regInfo.headimg || '';

		if (!checkMobil(regInfo.account)) {
			return callback('请输入正确手机号码');
		} 
		
		if (regInfo.code.length == 0) {
			return callback('请输入验证码');
		}
		
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		console.log(JSON.stringify(regInfo))
		var _state = owner.getState();
		mui.ajax(server + 'Api/V1/Register/index', {
			dataType: 'json', //服务器返回json格式数据
			data: {
				mobile: regInfo.account,
				password: regInfo.password,
				code: regInfo.code,
				open_id:regInfo.open_id,
				open_type:regInfo.open_type,
				nickname:regInfo.nickname,
				headimg:regInfo.headimg
			},
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒； 
			success: function(data) {
				if (data.status == 1) {
					// 	mui.toast(data.msg);
					console.log(JSON.stringify(data.info))
					return callback('',data.info);
				} else {
					return callback(data.msg);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				// var _json = JSON.parse(xhr.responseText)
				// console.log(_json.error)
				// console.log(xhr.status)
				// console.log(type)
				// console.log(errorThrown)
				mui.toast('网络异常');
			}
		});

		//		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		//		users.push(regInfo);
		//		localStorage.setItem('$users', JSON.stringify(users));
		//		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		var settings = owner.getSettings();
		settings.gestures = '';
		owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	var checkMobil = function(mobile) {
		mobile = mobile || '';
		var phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
		return (mobile.length == 11 && phoneReg.test(mobile));
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(forgetInfo, callback) {
		callback = callback || $.noop;
		if (!checkMobil(forgetInfo.mobile)) {
			return callback('手机号输入不正确');
		}

		if (!forgetInfo.code) {
			return callback('请输入验证码');
		}

		if (!forgetInfo.password) {
			return callback('请设置新密码');
		}
		//重置密码
		mui.ajax({
			url: server + 'Api/V1/Register/forget_pwd',
			type: 'POST',
			data: forgetInfo,
			dataType: 'json', //服务器返回json格式数据
			success: function(data) {
				// console.log(JSON.stringify(data))
				if (data.status == 1) {
					// mui.toast(data.msg);
					return callback();
				} else {
					return callback(data.msg);
				}
			},
			error: function(xhr, type, errorThrown) {
				mui.toast("请检查网络设置");
			}
		});
		// return callback(null, '短信验证码已发送，注意查收');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch (e) {}
		} else {
			switch (id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	};

	owner.HTMLDecode = function(text) {
		var temp = document.createElement("div");
		temp.innerHTML = text;
		var output = temp.innerText || temp.textContent;
		temp = null;
		return output;
	};
}(mui, window.app = {}));


/*渐显 opacity*/
function inOpacity(imgObj_id) {
	var imgDom = (typeof imgObj_id == "object") ? imgObj_id : document.getElementById(imgObj_id);
	imgDom.classList.add("anim_opacity"); //渐变动画
}
