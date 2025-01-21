import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import express from "express";

const app = express();
const port = 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

import cors from "cors";
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration

app.get("/user/:rfid", async (req, res) => {
  const { rfid } = req.params;
  const { data, error } = await supabase
    .from("pengguna")
    .select(`nama, kelas, jurusan, rfid`)
    .eq("rfid", rfid)
    .limit(1)
    .single();

  if (error) {
    const errorMessage =
      error.code == "PGRST116" ? "Kartu yang digunakan belum terdaftar" : error;
    return res.status(404).json({ message: errorMessage });
  }

  res.status(200).json(data);
});

app.get("/user/check/:rfid", async (req, res) => {
  const { rfid } = req.params;
  const { data: dataUser, error: errorUser } = await supabase
    .from("pengguna")
    .select(
      `
    user_id, nama, kelas, jurusan,
    kunjungan (
      timestamp, event
    )
  `
    )
    .eq("rfid", rfid)
    .order("timestamp", { referencedTable: "kunjungan", ascending: false })
    .limit(1, { referencedTable: "kunjungan" })
    .single();

  if (errorUser) {
    const errorMessage =
      errorUser.code == "PGRST116"
        ? "Kartu yang digunakan belum terdaftar"
        : errorUser;
    return res.status(404).json({ message: errorMessage });
  }

  const delta =
    new Date().getTime() - new Date(dataUser.kunjungan[0].timestamp).getTime();

  if (delta <= 1000 * 60 * 5) {
    return res.json({
      message:
        "Tunggu beberapa saat lagi ya, kamu hanya bisa keluar/masuk perpustakaan setiap 5 menit.",
    });
  }

  const checkValue =
    dataUser.kunjungan[0].event == "check_in" ? "check_out" : "check_in";

  const { data: dataKunjungan, error: errorInsert } = await supabase
    .from("kunjungan")
    .insert({ user_id: dataUser.user_id, event: checkValue })
    .select(
      `
      timestamp, event
      `
    )
    .limit(1)
    .single();

  if (errorInsert) {
    return res.json({ message: errorInsert });
  }

  res.status(200).json({
    nama: dataUser.nama,
    kelas: dataUser.kelas,
    jurusan: dataUser.jurusan,
    timestamp: dataKunjungan.timestamp,
    event: dataKunjungan.event,
  });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
