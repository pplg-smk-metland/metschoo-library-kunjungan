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

  mounted() {
    // Tambahkan logika redirect setelah 5 detik
    setTimeout(() => {
      this.$router.push("/"); // Ganti '/' dengan path halaman tapping Anda
    }, 5000); // 5000 ms = 5 detik
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
  <div class="background">
    <div class="container">
      <h1 class="title">RFID: {{ rfid }}</h1>

      <div v-if="user && user.message" class="error-message">
        <p>{{ user.message }}</p>
      </div>

      <div v-else-if="user && user.nama" class="user-info">
        <div class="info">
          <p><strong></strong> {{ user.nama }}</p>
          <p><strong></strong> {{ user.kelas }} {{ user.jurusan }}</p>

          <p><strong></strong> 2024-21-0113/12/4</p>
          <p><strong></strong> check_in tes</p>
        </div>
      </div>

      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>

      <div v-else class="loading">
        <p>Loading...</p>
      </div>
    </div>

    <div>
      <img
        src="https://raw.githubusercontent.com/pplg-smk-metland/metschoo-library/7b47c81ada79b2a73cc7f448c795cfbc10a7e43f/assets/profilepicture.svg"
        alt=""
      />
    </div>
  </div>
</template>

<style>
.error {
  color: red;
  font-weight: bold;
}

body {
  font-family: "Inter Variable", sans-serif;
}

.background {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10rem;
}

.background::before,
.backgorund::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -10;
}

.background::before {
  background: radial-gradient(
    ellipse at right bottom,
    hsl(177, 37.04%, 31.76%),
    transparent 30%
  );
}

.background::after {
  background: radial-gradient(
    ellipse at left top,
    hsl(177, 37.04%, 31.76%),
    transparent 30%
  );
}

.container {
  max-width: 100vw;
  margin: 20px auto;
  padding: 20px;

  border: 1px solid #4641416d;
  border-radius: 8px;
  background-color: #2f2e2e46;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  font-weight: bold;

  margin-bottom: 16px;
  text-align: center;
}

.error-message {
  color: #d9534f;
  font-weight: bold;
  background-color: #f8d7da;
  padding: 10px;
  border: 1px solid #f5c2c7;
  border-radius: 4px;
  margin-bottom: 20px;
}

.user-info {
  padding: 20px;
  border-radius: 8px;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
}

.user-info .info p {
  margin: 8px 0;

  font-size: 25px;
}

.user-info .info strong {
}

.loading {
  font-style: italic;
  text-align: center;
}
</style>
