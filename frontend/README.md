# Instruction for setting up Frontend server
0. Please check the `nodejs`, `npm`, and `yarn` are installed. Or
```bash
sudo apt install nodejs
sudo apt install npm
sudo npm install --global yarn
```

1. Install dependency
```bash
yarn install
```

2. Create static files
```bash
yarn deploy
```

3. Copy the static files to the corresponding directory
```bash
sudo cp -r ./build/* /var/www/html/
```

4. Restart `nginx`
```bash
sudo systemctl restart nginx 
```

### note
* package.json 

replace
```json
"browserslist": {
"production": [
  ">0.2%",
  "not dead",
  "not op_mini all"
],
"development": [
  "last 1 chrome version",
  "last 1 firefox version",
  "last 1 safari version"
]
},
```
with

```json
"browserslist": [
  ">0.2%",
  "not dead",
  "not op_mini all"
],
```


https://www.remove.bg/zh/upload


**********************************************


檔案名稱,檔案類型,修改核心重點
ProteinDetail.js,React 組件,重構為統一架構，優化數據加載邏輯，將 Reference 的作者改為僅顯示第一作者。
GeneDetail.js,React 組件,(同步修改) 統一使用 .detail-page 作用域，強化視覺層次感。
RNADetail.js,React 組件,(同步修改) 結構重構，移除 Histogram 組件以保持頁面簡潔。
Detail.css,樣式表,核心修改：設定右側留白 250px，限制寬度，並將表格字體加粗至 700/900。
Landing.js,React 組件,調整首頁佈局，置中 Introduction，優化 Logo 牆視覺效果與 Chatbot 區塊。
Landing.css,樣式表,設定星空背景全覆蓋 (100vw)，統一 Statistics 數據與標題為深藍色 (#2e3e93)。
Button.js,React 組件,修正 CancerType 與 Content 的按鈕組結構，移除內建顏色以利 CSS 覆寫。
Button.css,樣式表,核心修復：解決按鈕組背景尖角問題，設定 12px 圓角，調整按鈕間距與 Hover 變色。
App.js,React 核心,移除已刪除檔案 testTable.js 的引用 (Import) 與相關 Route。