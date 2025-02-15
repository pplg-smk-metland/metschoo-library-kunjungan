cd /home/orangepi/Music/songs/Song_2

git pull

nohup node server.mjs > backend.log 2>&1 &

cd /home/orangepi/metschoo-library-kunjungan

git pull origin main
npm run build

nohup npm run preview > frontend.log 2>&1 &

xset s off
xset -dpms
xset s noblank

unclutter -idle 5 -root &

until curl --output /dev/null --silent --head --fail http://localhost:4173; do
    echo "Sedang menunggu frontend berjalan..."
    sleep 5
done

chromium --kiosk --noerrdialogs --disable-infobars --disable-pinch --disable-gpu http://localhost:4173 &
