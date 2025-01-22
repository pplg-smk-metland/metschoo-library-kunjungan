<script setup>
let rfidInput = ""; // Variabel untuk menyimpan data RFID
document.addEventListener("keydown", (event) => {
  // Tangkap setiap input dari keyboard
  if (event.key === "Enter") {
    // Jika Enter ditekan, anggap data sudah lengkap
    window.location.href = `/user/${rfidInput}`;
    rfidInput = ""; // Reset variabel
  } else {
    rfidInput += event.key; // Tambahkan karakter ke rfidInput
  }
});
</script>

<template>
  <main>
    <p>TAPPING KARTU DISINI</p>
  </main>
</template>
