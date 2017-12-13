"use strict";

function swal_loader() {

}

swal_loader.prototype.show = function () {

    try {
        swal({
            title: '',
            type: '',
            html: '<div class="loader"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="3" stroke-miterlimit="10"/></svg></div>',
            showConfirmButton: false,
            showCloseButton: false,
            showCancelButton: false,
            allowOutsideClick: true
        });
    } catch (e) {
        console.log(e.message);
    }


}

swal_loader.prototype.hide = function () {

    try {
        swal.close();
    } catch (e) {
        console.log(e.message);
    }
}

var swal_loader = new swal_loader();
