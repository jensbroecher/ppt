server_path = "https://preciouspresenttruth.net/db/";
$(document).ready(function () {
    check_user_image();
    var user_id = localStorage.getItem("user_id");
    var first_name = localStorage.getItem("first_name");
    var last_name = localStorage.getItem("last_name");
    var email = localStorage.getItem("email");
    var user_id = localStorage.getItem("user_id");
    if (user_id) {
        document.getElementById("nav_name_display").innerHTML = first_name + " " + last_name;
        document.getElementById("nav_email_display").innerHTML = email;
    }
});

function generate_sec_key() {
    var seconds = new Date().getTime() / 1000;
    var sec_key = Math.floor(Math.random() * 1000000000);
    var sec_key = "" + sec_key + "" + seconds + "";
    var sec_key = sec_key.replace('.', '');
    return sec_key;
}

function check_user_image(action) {
    // Check if user has image on server and set it
    var user_id = localStorage.getItem("user_id");
    var user_image = new Image();
    user_image.onload = function () {
        console.log("user_image exists and is loaded");
        setTimeout(function () {
            try {
                if (user_id != null) {
                    var sec_key = localStorage.getItem("sec_key");
                    if (action == "account") {
                        // https://ub-fm.com/db/thumb.php?src=./photos/844.jpg&size=100 x100&crop=1&trim=1
                        document.getElementById("account_user_photo").style.backgroundImage = "url('" + server_path + "thumb.php?src=./photos/" + user_id + ".jpg&size=300x300&crop=1&trim=1')";
                    } else {
                        document.getElementById("user_photo").style.backgroundImage = "url('" + server_path + "thumb.php?src=./photos/" + user_id + ".jpg&size=300x300&crop=1&trim=1')";
                    }
                }
            } catch (err) {
                console.log(err.message);
            }
        }, 2000);
    }
    user_image.onerror = function () {
        console.log("user_image does not exist");
    }
    var user_id = localStorage.getItem("user_id");
    try {
        if (user_id != null) user_image.src = "" + server_path + "photo/" + user_id + ".jpg";
    } catch (err) {
        console.log(err.message);
    }
}

function start_sign_up() {
    first_name = document.getElementById('first_name').value;
    last_name = document.getElementById('last_name').value;
    phone = document.getElementById('phone').value.replace(/^[0]+/g, "");
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
    country = $("#country").val();
    localStorage.setItem('first_name', first_name);
    localStorage.setItem('last_name', last_name);
    localStorage.setItem('email', email);
    localStorage.setItem('phone', phone);
    localStorage.setItem('country', country);
    complete_sign_up();
}

function start_sign_in() {
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
    sec_key = generate_sec_key();
    swal_loader.show();
    $.get("" + server_path + "account.php", {
        task: "sign_in",
        email: email,
        password: password,
        sec_key: sec_key
    }).done(function (data) {
        swal_loader.hide();
        if (data == "email_wrong") {
            sweetAlert('', 'No account found for ' + email + '.', '');
            return;
        }
        if (data == "password_wrong") {
            sweetAlert('', 'Wrong password for ' + email + '.', '');
            return;
        } else {
            if (data == "") {
                console.log("No server response");
                sweetAlert('', 'The server did not respond. Please try again later.', '');
                return;
            }
            var signin_array = data.split(',');
            user_id = signin_array[0];
            first_name = signin_array[1];
            last_name = signin_array[2];
            phone = signin_array[3];
            test_account = signin_array[4];
            if (first_name == undefined) {
                swal("Error. Please try again.");
                return;
            }
            if (first_name == "") {
                swal("Error. Please try again.");
                return;
            }
            console.log("Sign in succesful");
            $("#overlay").fadeOut();
            $("#icons").show();
            document.getElementById("nav_name_display").innerHTML = first_name + " " + last_name;
            document.getElementById("nav_email_display").innerHTML = email;
            localStorage.setItem("user_id", user_id);
            localStorage.setItem("email", email);
            localStorage.setItem("first_name", first_name);
            localStorage.setItem("last_name", last_name);
            localStorage.setItem("phone", phone);
            localStorage.setItem("sec_key", sec_key);
            localStorage.setItem("test_account", test_account);
            check_user_image();
            start_chat_init();
        }
    });
}

function complete_sign_up() {
    swal_loader.show();
    sec_key = generate_sec_key();
    localStorage.setItem("sec_key", sec_key);
    console.log("sec_key: " + sec_key);
    $.get("" + server_path + "account.php", {
        task: "sign_up",
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        email: email,
        password: password,
        country: country,
        sec_key: sec_key
    }).done(function (data) {
        if (data == "password_too_short") {
            sweetAlert('', 'The password is too short.', '');
            return;
        }
        if (data == "password_no_letter") {
            sweetAlert('', 'The password must contain letters.', '');
            return;
        }
        if (data == "email_error") {
            sweetAlert('', 'E-Mail format wrong.', '');
            return;
        }
        if (data == "email_taken") {
            sweetAlert('', 'This E-Mail is already registered.', '');
            return;
        }
        if (data == "phone_taken") {
            sweetAlert('', 'This phone number is already registered.', '');
            return;
        } else {
            console.log("Sign up succesful");
            document.getElementById("nav_name_display").innerHTML = first_name + " " + last_name;
            document.getElementById("nav_email_display").innerHTML = email;
            localStorage.setItem("user_id", data);
            $("#overlay").fadeOut();
            $("#icons").show();
            swal_loader.hide();
            check_user_image();
            start_chat_init();
        }
    });
}

function sign_out() {
    swal({
        title: '',
        text: 'Are you sure you want to sign out?',
        showCancelButton: true,
        confirmButtonText: 'Sign Out'
    }).then(function () {
        localStorage.clear();
        location.reload();
    });
}

function forgot_account() {
    swal({
        title: '',
        text: 'Enter your E-Mail:',
        input: 'text',
        showCancelButton: true,
        inputValidator: function (value) {
            return new Promise(function (resolve, reject) {
                if (value) {
                    resolve()
                } else {
                    reject('Please check your E-Mail!')
                }
            })
        }
    }).then(function (result) {
        sec_key = generate_sec_key();
        localStorage.setItem("sec_key", sec_key);
        localStorage.setItem("email", result);
        change_password();
    })
}

function change_password() {
    sec_key = localStorage.getItem("sec_key");
    email = localStorage.getItem("email");
    $.get("" + server_path + "password_recovery.php", {
        task: "start",
        email: email,
        randomclientid: sec_key
    }).done(function (data) {
        swal("", "We sent instructions to: " + email + "", "");
    });
}

function update_photo() {
    try {
        navigator.camera.getPicture(onPhotoSuccess, onPhotoFail, {
            quality: 50,
            targetWidth: 640,
            targetHeight: 480,
            allowEdit: true,
            correctOrientatin: true,
            encodingType: Camera.EncodingType.JPEG,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: Camera.DestinationType.FILE_URI
        });
    } catch (err) {
        console.log("Can not set photo.");
    }
}

function onPhotoSuccess(imageURI) {
    var sec_key = localStorage.getItem("sec_key");
    document.getElementById("user_photo").style.backgroundImage = "url('" + imageURI + "?" + sec_key + "')";
    if (document.getElementById("account_user_photo")) {
        document.getElementById("account_user_photo").style.backgroundImage = "url('" + imageURI + "?" + sec_key + "')";
    }
    var win = function (r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    }
    var fail = function (error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }
    var user_id = localStorage.getItem("user_id");
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    var params = {};
    params.value1 = "" + user_id + "";
    params.value2 = "photo_upload";
    options.params = params;
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("" + server_path + "photo_upload.php"), win, fail, options);
}

function onPhotoFail(message) {
    // alert('Failed because: ' + message);
}
