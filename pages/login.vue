<template>
  <div class="auth-container">
    <section id="firebaseui-auth-container"></section>
  </div>
</template>

<style>
.auth-container {
  display: inline-block;
}
</style>

<script>
import firebase from "firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
export default {
  name: "Login",
  data() {
    return {};
  },
  mounted() {
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    var uiConfig = {
      signInSuccessUrl: this.$router.options.base, // This redirect can be achived by route using callback.
      signInFlow: "popup",
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>
