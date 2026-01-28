const CubeDB = {
    name: 'cube',
    version: 1,
    store: 'data',
    db: null,
    init() {
        const request = indexedDB.open(this.name, this.version);
        request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            const objectStore = this.db.createObjectStore(this.store, {
                keyPath: "id", autoIncrement: true
            });
            const datasetIndex = objectStore.createIndex("by_dataset", "dataset");
        };
        request.onsuccess = (event) => {
            this.db = event.target.result;
        };
    },
    storeData(data) {
        const transaction = this.db.transaction([this.store], "readwrite");
        const objectStore = transaction.objectStore(this.store);
        objectStore.put({dataset: data.dataset, time: data.time, scramble: data.scramble, date: data.date});
    },
    getData(dataset) {
        const transaction = this.db.transaction([this.store], "readonly");
        const objectStore = transaction.objectStore(this.store);
        const index = objectStore.index("by_dataset");
        const request = index.getAll(dataset);
        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve(request.result ? request.result : null);
            };
            request.onerror = (event) => {
                reject(new Error("Data retrieval failed"));
            };
        });
    },
    getSingleData(cubeid) {
        const transaction = this.db.transaction([this.store], "readonly");
        const objectStore = transaction.objectStore(this.store);
        const request = objectStore.get(Number(cubeid));
        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve(request.result ? request.result : null);
            };
            request.onerror = (event) => {
                reject(new Error("Data retrieval failed"));
            };
        });
    },
    getAllData() {
        const transaction = this.db.transaction([this.store]);
        const objectStore = transaction.objectStore(this.store);
        const request = objectStore.getAll();
        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve(request.result ? request.result : null);
            };
            request.onerror = (event) => {
                reject(new Error("Data retrieval failed"));
            };
        });
    },
    removeSingleData(cubeid){
        const transaction = this.db.transaction([this.store], "readwrite");
        const objectStore = transaction.objectStore(this.store);
        const request = objectStore.delete(Number(cubeid));
        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve(true);
            };
            request.onerror = (event) => {
                reject(false);
            };
        });
    }
};
CubeDB.init();
