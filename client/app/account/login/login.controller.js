'use strict';

class LoginController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  constructor(Auth, $state, menu, $window, $stateParams) {
    this.Auth = Auth;
    this.$state = $state;
    this.$window = $window;
    this.message = $stateParams.message;
    this.redirect = $stateParams.redirect;
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Logged in, redirect to home
        if (this.redirect) {
          this.$state.go(this.redirect.name);
        } else {
          this.$state.go('main');
        }
        // this.$window.location.reload();
      })
      .catch(err => {
        this.errors.other = err.message;
      });
    }
  }
}

angular.module('brewfinderwebApp')
  .controller('LoginController', LoginController);
