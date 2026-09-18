# 雲林健康好食｜部署與維護說明

以餐點為主、店家為輔的雲林縣 115 年健康餐點搜尋網站。相同名稱的餐點合併呈現；使用者允許定位後，優先顯示符合篩選條件且距離最近的供應店家，展開詳情後可查看其他分店。

- **正式網站**：[雲林健康好食](https://yht5582-source.github.io/healthstore/)
- **程式儲存庫**：[yht5582-source/healthstore](https://github.com/yht5582-source/healthstore)
- **部署設定**：[Settings → Pages](https://github.com/yht5582-source/healthstore/settings/pages)
- **發布紀錄**：[Actions](https://github.com/yht5582-source/healthstore/actions)

## 功能與資料

| 項目 | 說明 |
| --- | --- |
| 餐點資料 | 48 道不重複餐點、51 筆餐點供應紀錄、44 家商家、20 個鄉鎮市 |
| 搜尋與分類 | 搜尋餐點名稱中的食材文字、餐點、店名、鄉鎮或地址；可依餐點類型篩選 |
| 健康元素 | 減糖、減鹽、符合飲食建議，標示綁定各店的個別餐點 |
| 附近搜尋 | 開啟定位後，可依 1／3／5／10 公里範圍篩選，或不限距離 |
| 最近店家 | 同一餐點優先顯示最近的供應店家；其他店家依距離排列 |
| 聯絡與導航 | 店家詳情提供地址、電話、Google Maps 及導航連結 |
| 手機操作 | 響應式版面、分類橫向捲動、可關閉的店家詳情視窗 |

「最近」是目前篩選條件下的**直線距離**，不等於開車或步行路線。未開啟定位時顯示供應店家資訊，不宣稱某店最近。食材搜尋依現有文字比對，沒有完整食材表或過敏原資料。

## 技術與環境需求

網站採原生 HTML、CSS、JavaScript，資料隨網站提供，沒有後端、資料庫或外部套件依賴。

- GitHub Pages 可直接發布，**不需執行 npm install 或建置指令**。
- 瀏覽網站不需要 Node.js 或 Python，也不需要 Google Maps API 金鑰。
- 本機維護使用 Git；資料同步與測試使用 Node.js；預覽範例使用 Python 3。
- 正式網站使用 HTTPS；定位仍需使用者允許瀏覽器存取位置。
- 地圖按鈕開啟 Google Maps；本頁本身不嵌入地圖，也不在使用時呼叫地址查詢 API。

## GitHub Pages 部署

目前專案已使用 `main` 分支根目錄發布。以下步驟適用於重新設定或維護者接手。

1. 開啟 [healthstore 儲存庫](https://github.com/yht5582-source/healthstore)，確認 `main` 根目錄有 `index.html`、`style.css`、`data.js`、`core.js`、`app.js` 及 `.nojekyll`。
2. 進入 **Settings → Pages**。
3. 在 **Build and deployment** 設定：

   | 設定 | 值 |
   | --- | --- |
   | Source | Deploy from a branch |
   | Branch | main |
   | Folder | / (root) |

4. 按 **Save**。保留根目錄的 `.nojekyll`，以純靜態檔案發布。
5. 到 [Actions](https://github.com/yht5582-source/healthstore/actions) 確認 Pages 發布工作成功，再開啟正式網站。發布需要處理時間，以工作結果為準。
6. 使用預設網域並保留 HTTPS。正確網址含專案路徑：**https://yht5582-source.github.io/healthstore/**。

後續提交至 `main` 會觸發重新發布，不必每次重設 Pages。此專案不需要另寫自訂部署 workflow；Pages 仍會在 Actions 留下發布工作紀錄。設定方式可參考 [GitHub 官方部署說明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 本機預覽

首次取得專案：

```sh
git clone https://github.com/yht5582-source/healthstore.git
cd healthstore
```

在專案根目錄啟動預覽：

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Windows 若使用 Python Launcher，可改用 `py -m http.server 8765 --bind 127.0.0.1`；其他系統若指令名稱是 `python3`，請替換前面的 `python`。

開啟 [本機預覽](http://127.0.0.1:8765/)。停止預覽時，在終端機按 **Ctrl+C**。使用 localhost 或 127.0.0.1 預覽定位功能；避免用直接雙擊 HTML 的方式測試定位。

## 檔案結構

```text
healthstore/
├── index.html       # 頁面結構、搜尋控制項與資料說明
├── style.css        # 桌面與手機樣式
├── app.js           # 畫面互動、定位、詳情與導航
├── core.js          # 餐點篩選、合併及距離計算
├── data.json        # 維護用資料，優先編輯此檔
├── data.js          # 由 data.json 同步產生，供瀏覽器載入
├── sync-data.cjs    # 資料同步工具
├── test.cjs         # 資料與搜尋邏輯測試
├── favicon.svg      # 網站圖示
├── .nojekyll        # 純靜態發布設定
├── LICENSE
└── README.md
```

## 更新餐點、店家與座標

1. 編輯 `data.json`，保留有效 JSON 格式，不加註解或尾端多餘逗號。
2. 在專案根目錄執行：

   ```sh
   node sync-data.cjs
   node test.cjs
   ```

3. 重新整理本機預覽，檢查變更的餐點、店家詳情及篩選結果。
4. 將 **data.json 與 data.js 一起提交**。網頁讀取的是 `data.js`，只改 JSON 不會更新畫面。

### 資料欄位

| 欄位 | 用途 |
| --- | --- |
| `year`、`updated`、`source` | 資料年度、整理日期及來源 |
| `stores[].id` | 店家唯一編號；餐點以此連結，既有編號勿任意更動 |
| `name`、`town`、`address`、`phones` | 網頁呈現的店家名稱、鄉鎮、地址及電話陣列 |
| `lat`、`lng` | 已核對店家緯度、經度，使用數值；無法確認時填 `null` |
| `mapUrl`、`checkedAt`、`locationStatus` | 查核地圖連結、日期及狀態 |
| `sourceAddress`、`sourcePhones` | 保留原始資料，方便追溯 |
| `mapAddress`、`mapPhone`、`note` | 地圖資訊與差異說明；`note` 顯示在店家詳情 |
| `offers[].storeId` | 供應該餐點的店家編號 |
| `offers[].name` | 餐點名稱；目前以完全相同名稱合併，需一致命名 |
| `offers[].category` | 飯食・餐盒、麵食、麵包・甜點、飲品、其他餐點 |
| `offers[].health` | 健康元素陣列，例如 `["減糖", "減鹽"]`，依原始資料填寫 |

同一家店有多道餐點時，新增多筆 `offers`；同一道餐點由多家店供應時，保留相同餐點名稱，分別連結各店 `storeId`。健康元素依各筆供應紀錄填寫，不從整家店推定。

核對 Google Maps 時，請比對**店名、地址與電話**，取實際店家標記座標，不能將地圖視野中心或鄉鎮中心當成店家。已知門牌但未確認店家身分時，`lat/lng` 仍保留 `null`；`addressLat/addressLng` 只作查核紀錄，不供附近推薦使用。

更新年度或商家數量時，也要同步檢查 `index.html` 的年度、頁尾統計與整理日期，以及本 README 的統計。這些說明文字目前不是全部由資料檔自動產生。

## 測試與發布更新

日常維護指令：

```sh
node sync-data.cjs
node test.cjs
git diff --check
git diff
git add data.json data.js
git commit -m "Update meal and store data"
git push origin main
```

上述提交範例只包含資料檔；若修改 HTML、CSS、JavaScript 或 README，請將實際修改檔案加入 `git add`。

`test.cjs` 檢查資料數量、餐點合併、分店最近排序、半徑與鄉鎮篩選、餐點健康標示、缺少座標與空結果。既有測試含 115 年資料的固定數量及指定分店案例；新增或移除資料時，需依實際資料更新合理的預期值，並保留行為測試。

發布前建議實測：

- 搜尋「三色吐司」得到一道餐點及兩家供應店家。
- 選擇「麵食＋減鹽＋北港鎮」得到目前資料中的兩道餐點。
- 開啟定位後，相同餐點優先列最近店家，其他供應店家依距離排列。
- 拒絕定位仍可使用文字、類型、健康元素及鄉鎮篩選。
- 沒有結果時可以清除篩選；手機畫面可操作且沒有整頁橫向溢出。
- 店家詳情的地圖、導航目的地及撥號連結正確。

測試指令目前由維護者手動執行，**沒有設定自動測試工作流程**。Pages 發布成功不等於上述測試已自動執行。

## 常見問題

| 問題 | 檢查方式 |
| --- | --- |
| 網站 404 | 確認網址含 `/healthstore/`、Pages 指向 `main / (root)`、根目錄有 `index.html`，並查看 Actions |
| 修改後仍是舊內容 | 確認已推送到 `main` 且發布完成；資料更新需同步提交 `data.js`；再強制重新整理 |
| 樣式或清單未載入 | 確認 `style.css`、`data.js`、`core.js`、`app.js` 都在同一發布目錄，大小寫與 HTML 引用一致 |
| 定位無法使用 | 確認 HTTPS、瀏覽器及作業系統定位權限；也可改用鄉鎮篩選 |
| 距離篩選不能選 | 須先成功取得定位；拒絕、失敗或取消定位時會停用 |
| 某家店未出現在附近結果 | 確認篩選條件、距離及座標；`lat/lng` 為 `null` 的店不列入半徑篩選 |
| 兩家同名餐點沒有合併 | 檢查 `offers[].name` 是否完全相同，包含空白與標點 |
| 更新後測試失敗 | 先確認不是資料錯誤，再核對固定數量及既有測試案例是否需要配合更新 |

## 資料來源、差異與限制

來源為提供的 `115YH02850_1_11113035454.pdf`，標題「115年輔導健康商家資料」。2026-09-18 完成逐家 Google Maps 查核，42 家有已確認店家座標；原 PDF 未隨儲存庫附上。

- 北港「恩典手工餅乾坊」、元長「ㄚ好嬸 古早味紅茶冰」只確認門牌，尚未確認同名商家。可查詢原資料及電話，但不列入半徑篩選；不限半徑的定位排序中列於已知距離之後。
- 土庫玉津咖啡採 Google Maps 的中正路230號，保留 PDF 原址中山路124號及差異說明，電話相同。
- 劍湖山渡假大飯店依[雲林縣旅遊網](https://tour.yunlin.gov.tw/mainssl/modules/MySpace/BlogInfo.php?xmlid=1037016)補齊永光村大湖口67之8號，位置經 Google Maps 核對。
- 曉明牛肉麵在 Google Maps 名稱為「東勢牛肉麵／燴飯」，門牌及電話吻合。
- 地圖與 PDF 電話不同時，目前撥號保留 PDF 原電話，差異列於詳情；維護者應查證後再更新。

健康標示僅適用於原資料列出的餐點，不代表整家店。網站未提供營養數值、熱量、價格、完整菜單或即時營業狀態，餐點供應請向店家確認。

## 定位與隱私

使用者的位置只保存在本次頁面記憶體，於瀏覽器內計算距離；網站程式不將位置上傳、不寫入 localStorage，也未安裝分析追蹤。取消定位會清除本頁使用的位置。

點選 Google Maps 或導航會開啟外部服務，由 Google Maps 處理路線及其所需權限。程式授權請參閱 [LICENSE](./LICENSE)；商家資料來源另如上列說明。
