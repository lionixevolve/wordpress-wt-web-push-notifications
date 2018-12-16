jQuery( document ).ready(function() {
	var config = {
		apiKey: wtwpnfirebase.WTWPN_Setting_api,
		authDomain: wtwpnfirebase.WTWPN_Setting_project + ".firebaseapp.com",
		databaseURL: "https://" + wtwpnfirebase.WTWPN_Setting_project + ".firebaseio.com",
		storageBucket: wtwpnfirebase.WTWPN_Setting_project + ".appspot.com",
		messagingSenderId: wtwpnfirebase.WTWPN_Setting_sender,
	};
	firebase.initializeApp(config);
	// Retrieve Firebase Messaging object.
	const messaging = firebase.messaging();
	
	jpInit();
	
	function jpInit() { 
		if(getCookie('wtwpnsent') == 0)
		{
			// On load register service worker
			if ('serviceWorker' in navigator) { 
				navigator.serviceWorker.register(wtwpnfirebase.sw_url).then((registration) => {
				  // Successfully registers service worker
				  console.log('ServiceWorker registration successful with scope: ', registration.scope);
				  messaging.useServiceWorker(registration);
				})
				.then(() => {
				  // Requests user browser permission
				  return messaging.requestPermission();
				})
				.then(() => { 
				  // Gets token
				  return messaging.getToken();
				})
				.then((token) => {
				  // Simple ajax call to send user token to server for saving
				  var storeurl = wtwpnfirebase.baseurl;
				  jQuery.ajax({
					type: 'post',
					url: storeurl,
					data: {key: token, browser: wtwpnfirebase.browser, Userid: wtwpnfirebase.userid, action: 'wtwpn_subscriber_save'},
					success: (data) => {
					  console.log('Success ', data);
					  document.cookie = "wtwpnsent = 1;"
					},
					error: (err) => {
					  console.log('Error ', err);
					}
				  })
				})
				.catch((err) => {
				  console.log('ServiceWorker registration failed: ', err);
				});
			}
		}
	}
});
	
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(cname) {
	 document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


