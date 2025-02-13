<script setup>
let rfidInput = ""; // Variabel untuk menyimpan data RFID
document.addEventListener("keydown", (event) => {
  // Tangkap setiap input dari keyboard
  if (event.key === "Enter") {
    // Jika Enter ditekan, anggap data sudah lengkap
    window.location.href = `/user/${rfidInput}`;
    rfidInput = ""; // Reset variabel
  } else if (!isNaN(event.key) && event.key !== " ") {
    rfidInput += event.key; // Tambahkan karakter ke rfidInput
  }
});
</script>

<template>
  <main>
    <div class="container">
      <h2>Selamat Datang di Metschoo Library</h2>
      <img src="https://metschoo-lib-preview.netlify.app/logo.svg" alt="" />
      <h2>Silahkan Tap Kartu Anda</h2>
    </div>
  </main>
</template>
<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}
</style>
