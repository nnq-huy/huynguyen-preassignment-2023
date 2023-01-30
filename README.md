# solita-preassignment-2023

A repository for Solita Dev Academy 2023 pre-assignment

Applicant name :Nguyen Nhu Quang Huy

Technology stack used:
    - Back-end: Node.JS with Express
    - Database: PostgresSQL
    - Front-end: ReactNative on Android.

## Backend: contains NodeJS server with APIs to access PostgreSQL database. Stations and journeys data are stored on a PostgreSQL running on my linode VPS.
### Dependencies:
- body-parser, express
- fast-csv
- multer
- pg, pg-promise, pg-hstore
- dotenv, cross-env, nodemon
- jest, supertest
### To run the backend:
1. Clone the repository, go to <em>backend</em> folder using terminal:
```
git clone https://github.com/nnq-huy/huynguyen-preassignment-2023.git
cd backend
```
2. Install dependencies:
```
npm install
```
3. Replace PGPASSWORD in env.dev , env.test with abc123
4. Run the tests with test database
```
npm test
```
5. Run the backend with dev/production database
```
npm start dev
```
API endpoints running on my Linode VPS:
<ul>
<em>
<li>GET: http://143.42.29.50:3000/ </li>
<li>GET: http://143.42.29.50:3000/stations </li>
<li>GET: http://143.42.29.50:3000/journeys </li>
<li>GET: http://143.42.29.50:3000/stations/id=1 </li>
<li>POST: http://143.42.29.50:3000/upload/stations with a field "file" and a file in formdata</li>
<li>POST: http://143.42.29.50:3000/journeys/new with a JSON object in request body </li>
<li>POST: http://143.42.29.50:3000/stations/new with a JSON object in request body </li>

</em>
</ul>

## Frontend: a ReactNative application created with Expo, configured to run on Android

### To test the app:
1. Clone the repository(if backend setup step is skipped), go to react-native-front-end folder using terminal:
```
git clone https://github.com/nnq-huy/huynguyen-preassignment-2023.git
cd react-native-front-end
```
2. Install dependencies:
```
npm install
```
3. Start expo metro bundler:
```
npx expo start
```
4. Press "a" on terminal to start application on Android Emulator/Android Phone
## Project folder structure:
<em>

```
backend/
├─ controllers/
│  ├─ csv_to_db.js
│  ├─ db_queries.js
│  ├─ file_upload.js
├─ routes/
│  ├─ index.js
├─ tests/
│  ├─ index.js
│  ├─ testfile.csv
│  ├─ validation.test.js
├─ .gitignore
├─ index.js
├─ package.json
```
-React-native-front-end: contains ReactNative application created with Expo, configured to run on Android

```
react-native-front-end/
├─ assets/
├─ src/
│  ├─ components/
│  │  ├─ StationDetail.tsx
│  │  ├─ StationList.tsx
│  ├─ screens/
│  │  ├─ HomeScreen.tsx
│  │  ├─ index.ts
│  │  ├─ JourneyScreen.tsx
│  │  ├─ StationScreen.tsx
│  ├─ utils/
│  │  ├─ backend.ts
│  │  ├─ types.ts
├─ .gitignore
├─ app.json
├─ App.tsx
├─ babel.config.js
├─ package.json
├─ tsconfig.json
```
</em>