const CubeDB = {
    name: 'cube',
    version: 2,
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
        const transaction = this.db.transaction([this.store]);
        const objectStore = transaction.objectStore(this.store);
        const index = store.index("by_dataset");
        const request = index.getAll(dataset);
        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve(request.result ? request.result.data : null);
            };
            request.onerror = (event) => {
                reject(new Error("Data retrieval failed"));
            };
        });
    },
};
CubeDB.init();
