<script>
export default {
  props: {
    rfid: String, // The RFID will be passed as a prop
  },

  data() {
    return {
      user: null, // To store the fetched user data
      error: null, // To store any error message
    };
  },

  async beforeRouteEnter(to, from, next) {
    try {
      const rfid = to.params.rfid; // Extract RFID from the route parameter
      const response = await fetch(`http://localhost:3000/user/${rfid}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const user = await response.json();
      next((vm) => vm.setUser(user)); // Call the `setUser` method
    } catch (err) {
      next((vm) => vm.setError(err)); // Call the `setError` method
    }
  },

  beforeRouteUpdate(to, from) {
    this.user = null; // Clear current user data
    fetch(`http://localhost:3000/user/${to.params.rfid}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((user) => this.setUser(user))
      .catch((err) => this.setError(err));
  },

  methods: {
    setUser(user) {
      this.user = user;
    },
    setError(err) {
      this.error = err.message || "Ada error tidak diketahui";
    },
  },
};
</script>

<template>
  <div>
    <h1>RFID: {{ rfid }}</h1>

    <div v-if="user">
      <h2>User Information</h2>
      <p><strong>Nama:</strong> {{ user[0].nama }}</p>
      <p><strong>Kelas:</strong> {{ user[0].kelas }}</p>
      <p><strong>Jurusan:</strong> {{ user[0].jurusan }}</p>
      <!-- <div v-if="user.kunjungan">
        <h3>Last Visit</h3>
        <p><strong>Event:</strong> {{ user.kunjungan.event }}</p>
        <p><strong>Timestamp:</strong> {{ user.kunjungan.timestamp }}</p>
      </div> -->
    </div>

    <div v-else-if="error">
      <p class="error">{{ error }}</p>
    </div>

    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<style>
.error {
  color: red;
  font-weight: bold;
}
</style>
