<template>
  <div class="h-full bg-gray-100">
    <div class="h-full">
      <!-- <SideBar v-if="$route.path !== '/login'"></SideBar>
      <TopBar v-if="$route.path !== '/login'"></TopBar> -->
      <div v-if="$route.path !== '/login'" class="h-full">
        <main class="flex-1 h-full">
          <div class="h-full">
            <router-view></router-view>
          </div>
        </main>
      </div>
      <div v-else>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  created() {
    axios.interceptors.response.use(
      response => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      error => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        if (error.response.status == 401) {
          this.$router.push("/login");
        }
        return Promise.reject(error);
      }
    );
  }
};
</script>
