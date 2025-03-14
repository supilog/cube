const DB_NAME = 'cube';
const DB_VERSION = 3;
const storeName = 'data';
let db;
let objStore;
let items = [];


const request = indexedDB.open(DB_NAME, DB_VERSION);
// open失敗
request.onerror = (event) => {
    window.alert('データの保存に失敗しました');
};

request.onsuccess = (event) => {
    db = request.result;
};

request.onupgradeneeded = (event) => {
    db = request.result;
    objStore = db.createObjectStore(storeName, {keyPath: "id", autoIncrement: true});
    const datasetIndex = objStore.createIndex("by_dataset", "dataset");

    const data = [
        {
            dataset: 1,
            time: 41581,
            scramble: 'B D\' B2 R D2 R D\' B L2 F2 U2 D\' B2 L2 U\' B2 D B2 U\' R',
            date: 1741489549,
        },
        {
            dataset: 2,
            time: 39581,
            scramble: 'B D\' B2 R D2 R D\' B L2 F2 U2 D\' B2 L2 U\' B2 D B2 U\' R',
            date: 1741499549,
        },
        {
            dataset: 1,
            time: 65581,
            scramble: 'B D\' B2 R D2 R D\' B L2 F2 U2 D\' B2 L2 U\' B2 D B2 U\' R',
            date: 1741519549,
        }
    ];
    objStore.put(data[0]);
    objStore.put(data[1]);
    objStore.put(data[2]);
};


document.getElementById('scramble').addEventListener('click', function () {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const index = store.index("by_dataset");

    const allResult = index.getAll(1);
    allResult.onsuccess = (event) => {
        items = event.target.result;
    };
});

document.getElementsByTagName('header')[0].addEventListener('click', function () {
    console.log(items);
});
