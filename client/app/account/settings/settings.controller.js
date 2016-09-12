'use strict';

class SettingsController {
  //start-non-standard
  errors = {};
  submitted = false;
  //end-non-standard

  constructor(Auth, userprofiles, $mdToast) {
    this.Auth = Auth;
    this.userprofiles = userprofiles;
    var promiseThis = this;
    this.user = this.userprofiles.getMe().then(function(result) {
      promiseThis.user = result.data;
    });
    this.mdToast = $mdToast;
  }

  changePassword(form) {
    this.submitted = true;

    if (form.$valid) {
      if (this.user.newPassword) {
        this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
          .then(() => {
            this.message = 'Password successfully changed.';
          })
          .catch(() => {
            form.password.$setValidity('mongoose', false);
            this.errors.other = 'Incorrect password';
            this.message = '';
          });
      } else if (this.user.bio || this.user.alias){
        var that = this;
        this.userprofiles.updateSettings(that.user).then(function(result) {
          if (result.status < 400) {
            that.message = 'User successfully updated.';
          }
        })
        .catch((err => {
            err = err.data;
            this.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, (error, field) => {
              form[field].$setValidity('mongoose', false);
              this.errors[field] = error.message;
            });
        }));



      }

    }
  }
}

angular.module('brewfinderwebApp')
  .controller('SettingsController', SettingsController);
