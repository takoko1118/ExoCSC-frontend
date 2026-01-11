 grep -rn "db.cmdm.tw" .


 # 進入前端目錄
cd ~/ExoCSC_DB/ExoCSC-frontend/frontend

# 全域取代 db.cmdm.tw 為新 IP (涵蓋所有資料夾)
find . -type f -exec sed -i 's/db.cmdm.tw/172.16.146.196/g' {} +

# 將 13007 埠號統一改為 3000
find . -type f -exec sed -i 's/172.16.146.196:13007/172.16.146.196:3000/g' {} +


cat package.json | grep "start"




cd /home/takoko1118/ExoCSC_DB/ExoCSC-frontend/frontend

# 強制遞迴搜尋所有 .js 檔案，將 db.cmdm.tw 替換為新 IP
find src/ -name "*.js" -type f -exec sed -i 's/db.cmdm.tw/172.16.146.196/g' {} +

# 同時確保埠號也對應正確 (前端 3000, 後端 8000)
find src/ -name "*.js" -type f -exec sed -i 's/172.16.146.196:13007/172.16.146.196:3000/g' {} +

***********************************************************************************************************

cd /home/takoko1118/ExoCSC_DB/ExoCSC-frontend/frontend/
find src/ -type f -name "*.js" -exec sed -i 's/db.cmdm.tw/172.16.146.196/g' {} +
find src/ -type f -name "*.js" -exec sed -i 's/172.16.146.196:13007/172.16.146.196:3000/g' {} +

grep "172.16.146.196" /home/takoko1118/ExoCSC_DB/ExoCSC-frontend/frontend/src/Table/GeneDetail.js

sed -i '/"start":/c\        "start": "NODE_OPTIONS=--openssl-legacy-provider react-scripts start",' package.json

-----------------------
清理 backup 資料夾（選做，不影響運行）
cd /home/takoko1118/ExoCSC_DB/ExoCSC-frontend/frontend
find backup/ -type f -exec sed -i 's/db.cmdm.tw/172.16.146.196/g' {} +



----------------------


http://172.16.146.196:3000


