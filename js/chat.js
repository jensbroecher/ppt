$(document).ready(function () {
    var chat_theme = localStorage.getItem("chat_theme");
    if (chat_theme) {
        $("head link#theme").attr("href", "themes/chat_theme_" + chat_theme + ".css");
    }
    var user_id = localStorage.getItem("user_id");
    var os_id = localStorage.getItem("os_id");
    if (user_id) {
        update_check = setInterval(getupdate, 10000);
        $.get("" + server_path + "chat/messages.php?task=os_id&user_id=" + user_id + "&os_id=" + os_id + "", function (data) {});
    }
});
// Used after login
function start_chat_init() {
    var user_id = localStorage.getItem("user_id");
    var os_id = localStorage.getItem("os_id");
    if (user_id) {
        update_check = setInterval(getupdate, 10000);
        $.get("" + server_path + "chat/messages.php?task=os_id&user_id=" + user_id + "&os_id=" + os_id + "", function (data) {});
    }
}

function getupdate() {
    var user_id = localStorage.getItem("user_id");
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;
        // console.log('Your current position is:');
        console.log('Latitude : ' + crd.latitude);
        console.log('Longitude: ' + crd.longitude);
        // console.log('Accuracy: ' + crd.accuracy + 'm');
        lat = crd.latitude;
        lng = crd.longitude;
        localStorage.setItem("lat", lat);
        localStorage.setItem("lng", lng);
    };

    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
    var lat = localStorage.getItem("lat");
    var lng = localStorage.getItem("lng");
    var platform = navigator.platform;
    var model = navigator.product;
    $.get("" + server_path + "update.php", {
        task: "get_update",
        user_id: user_id,
        lat: lat,
        lng: lng,
        platform: platform,
        model: model
    }).done(function (data) {
        var data = data.split(",");
        var up_n = data[0];
        var up_mbc = data[1];
        if (document.getElementById("menu_message_badge")) {
            document.getElementById("menu_message_badge").innerHTML = up_mbc;
        }
        if (up_mbc > 0) {
            console.log("Message Counter is higher than 0. It is " + up_mbc + ".");
            if (document.getElementById("chat_messages")) {
                check_chat_update();
                $("#overlay").fadeIn();
            } else {
                $("#icon_chat").click();
                message_center_audio.play();
            }
        }
        if (up_mbc = 0) {}
        if (up_n > 0) {
            var msg_id = up_n;
            $.get("" + server_path + "update.php?task=resetnotification&user_id=" + user_id + "&msg_id=" + msg_id + "", function (response) {
                console.log("Reset notification: " + response + "");
                var chat_active = sessionStorage.getItem("chat_active");
                if (chat_active == "Yes") {
                    check_chat_update();
                } else {
                    show_message(response);
                }
            });
        }
    });
}

function show_message(text) {
    var chat_open = sessionStorage.getItem("chat_open");
    if (chat_open == "Yes") {
        try {
            check_chat_update();
        } catch (err) {
            console.log(err.message);
        }
        return;
    } else {
        // swal(text);
    }
}

function send_message_to_customer_care_from_chat() {
    var send_button = document.getElementById("chat_send_btn");
    send_button.style.pointerEvents = "none";
    send_button.style.backgroundColor = "grey";
    var user_id = localStorage.getItem("user_id");
    var message_text = document.getElementById("chat_text_box").innerHTML;
    if (message_text == "") {
        send_button.style.pointerEvents = "all";
        send_button.style.backgroundColor = "#779B2F";
        return;
    }
    var message_text = encodeURIComponent(message_text);
    $.get("" + server_path + "chat/messages.php?task=response_chat&user_id=" + user_id + "&text=" + message_text + "", function (data) {
        send_button.style.pointerEvents = "all";
        send_button.style.backgroundColor = "#779B2F";
        document.getElementById("chat_text_box").innerHTML = "";
        check_chat_update();
    });
}

function open_chat(where) {
    if (localStorage.getItem("user_id")) {
        sessionStorage.setItem("chat_active", "Yes");
        var user_id = localStorage.getItem("user_id");
        // if (typeof chat_init !== 'undefined') {
        //    console.log("Chat has been initiated");
        //    hideloader();
        // } else {
        $.get("" + server_path + "chat/messages.php", {
            task: "init_chat",
            userid: user_id
        }).done(function (data) {
            chat_init = "Yes";
            try {
                $('#chat_messages').scrollTop($('#chat_messages').height() + 10000000000000000);
            } catch (err) {
                console.log(err.message);
            }
            $("#chat_send_btn").click(function () {
                send_message_to_customer_care_from_chat();
            });
        });
        // }
    } else {
        swal("You need to be signed in to use this service.");
        open_account_settings();
    }
}

function check_chat_update(type) {
    var ids = $("#chat_messages div[id]").map(function () {
        return parseInt(this.id, 10);
    }).get();
    var highest = Math.max.apply(Math, ids);
    var lowest = Math.min.apply(Math, ids);
    console.log(highest);
    if (highest == Number.POSITIVE_INFINITY || highest == Number.NEGATIVE_INFINITY) {
        console.log("Highest Message ID not found.");
    } else {}
    update_messages(highest);
}

function update_messages(update_id) {
    var user_id = localStorage.getItem("user_id");
    $.get("" + server_path + "chat/messages.php", {
        user_id: user_id,
        task: "update_messages",
        update_id: update_id
    }).done(function (data) {
        if (data != "") {
            if ($('#chat_messages').is(':empty')) {} else {
                if ("vibrate" in navigator) {
                    navigator.vibrate(300);
                    var play_sounds = localStorage.getItem("play_sounds");
                    message_center_audio.volume = 1;
                    message_center_audio.play();
                }
            }
            $("#chat_messages").append(data);
            $('#chat_messages').scrollTop($('#chat_messages').height() + 10000000000000000);
        }
    });
}

function chat_settings() {
    swal({
        input: 'select',
        inputOptions: {
            'gray': 'Gris',
            'blue': 'Bleu',
            'green': 'Vert'
        }
    }).then(function (result) {
        $("#chat_messages").fadeOut(function () {
            localStorage.setItem("chat_theme", result);
            $("head link#theme").attr("href", "themes/chat_theme_" + result + ".css");
            $("#chat_messages").fadeIn();
        });
    });
}
