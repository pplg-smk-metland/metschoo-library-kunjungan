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
    <h2>TAP KARTU ANDA DISINI</h2>
  </main>
</template>
