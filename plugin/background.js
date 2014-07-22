/**
 * Created by xesam [xesamguo@gmail.com] on 14-6-23.
 */

var tab_is_local_file_hash = {};
var ON_STR = 'ON';

var offline_eanable_bool = false;

function update_hash(tabId, tab_url){
    tab_is_local_file_hash[tabId] = offline_eanable_bool && -1 !== tab_url.search(/^file:/);
}

chrome.tabs.onCreated.addListener(function(tab){
    if(tab.url){
        update_hash(tab.id, tab.url);
    }
    chrome.browserAction.setBadgeText({text:  offline_eanable_bool ? ON_STR : ''});
});

function tab_update_listener(tabId, changeInfo, tab) {
    update_hash(tabId, tab.url);
};

chrome.tabs.onUpdated.addListener(tab_update_listener);

chrome.browserAction.onClicked.addListener(function(tab){
    offline_eanable_bool = offline_eanable_bool ? false : true;
    chrome.browserAction.setBadgeText({text:  offline_eanable_bool ? ON_STR : ''});
});


function request_filter_listener(details){
    var f = typeof tab_is_local_file_hash[details.tabId] != 'undefined'
            && tab_is_local_file_hash[details.tabId]
            && -1 !== details.url.search(/\w+\.(google|android|youtube|ggpht)[^.]*\.com/);
    return {
        'cancel' : f
    }
}

chrome.webRequest.onBeforeRequest.addListener(request_filter_listener, {
    'urls' : ["<all_urls>"]
}, ['blocking']);

