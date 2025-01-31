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
      const response = await fetch(`http://localhost:3000/user/check/${rfid}`);
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
    fetch(`http://localhost:3000/user/check/${to.params.rfid}`)
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
    }, 4000); // 5000 ms = 5 detik
  },

  methods: {
    setUser(user) {
      this.user = user;
    },
    setError(err) {
      this.error = err.message || "Ada error tidak diketahui";
    },
    formatDate(date) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      };
      return new Date(date).toLocaleString("id-ID", options); // Adjust "id-ID" for locale
    },
  },
};
</script>

<template>
  <div class="background">
    <div class="container">
      <!-- <h1 class="title">RFID: {{ rfid }}</h1> -->

      <div v-if="user && user.message" class="error-message">
        <p>{{ user.message }}</p>
      </div>

      <div v-else-if="user && user.nama" class="user-info">
        <div class="info">
          <h2>Terakhir Mengunjungi</h2>
          <p>
            <span
              :style="{ color: user.lastEvent == 'check_in' ? 'green' : 'red' }"
              >{{ user.lastEvent == "check_in" ? "Masuk" : "Keluar" }}</span
            >
            pada
            {{
              user.lastTimestamp ? formatDate(user.lastTimestamp) : "No Data"
            }}
          </p>

          <h2>Sekarang</h2>
          <p>
            <span
              :style="{ color: user.event == 'check_in' ? 'green' : 'red' }"
              >{{ user.event == "check_in" ? "Masuk" : "Keluar" }}</span
            >
            pada
            {{ user.timestamp ? formatDate(user.timestamp) : "No Data" }}
          </p>
        </div>
      </div>

      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>

      <div v-else class="loading">
        <p>Loading...</p>
      </div>
    </div>

    <div v-if="user && user.nama" class="foto">
      <img
        class="image"
        src="https://raw.githubusercontent.com/pplg-smk-metland/metschoo-library/7b47c81ada79b2a73cc7f448c795cfbc10a7e43f/assets/profilepicture.svg"
        alt=""
      />
      <p>{{ user.nama }}</p>
      <p>{{ user.kelas }} {{ user.jurusan }}</p>
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

.foto {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.foto img {
  padding-bottom: 5px;
  margin: auto;
}

.foto p {
  font-size: 22px;
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
}

.user-info {
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

  font-size: 20px;
}

.loading {
  font-style: italic;
  text-align: center;
}
.image {
  width: 75%;
}
</style>
