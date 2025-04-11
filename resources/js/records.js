const records = {
    init: function () {
        this.records();
    },
    records: async function () {
        var xhr = new XMLHttpRequest();
        let data = new Object();
        data.results = await CubeDB.getData(1);
        let json = JSON.stringify(data);
        xhr.open('POST', '/api/records');
        xhr.send(json);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const json = JSON.parse(xhr.responseText);
                    console.log(json.records.single);
                    json.records.single.forEach(result => {
                        const time = (result.time / 1000).toFixed(3);
                        const dateTime = new Date(result.date);
                        const dateText = dateTime.getFullYear().toString().padStart(4, '0')
                            + '/' + (dateTime.getMonth() + 1).toString().padStart(2, '0')
                            + '/' + dateTime.getDate().toString().padStart(2, '0');
                        const createElement = '<div class="wrapper sm:flex sm:flex-col"><div class="text-xl font-bold list-time">' + time + '</div><div class="sm:flex sm:flex-row text-cube-gray"><div>[' + dateText + ']</div><div>' + result.scramble + '</div></div>';
                        document.querySelector('#single .content').insertAdjacentHTML('beforeend', createElement);
                    });
                    json.records.ao5.forEach(result => {
                        const time = (result.time / 1000).toFixed(3);
                        const dateTime = new Date(result.date);
                        const dateText = dateTime.getFullYear().toString().padStart(4, '0')
                            + '/' + (dateTime.getMonth() + 1).toString().padStart(2, '0')
                            + '/' + dateTime.getDate().toString().padStart(2, '0');
                        const createElement = '<div class="wrapper sm:flex sm:flex-col"><div class="text-xl font-bold list-time">' + time + '</div><div class="sm:flex sm:flex-row text-cube-gray"><div>[' + dateText + ']</div></div>';
                        document.querySelector('#ao5 .content').insertAdjacentHTML('beforeend', createElement);
                    });
                    json.records.ao12.forEach(result => {
                        const time = (result.time / 1000).toFixed(3);
                        const dateTime = new Date(result.date);
                        const dateText = dateTime.getFullYear().toString().padStart(4, '0')
                            + '/' + (dateTime.getMonth() + 1).toString().padStart(2, '0')
                            + '/' + dateTime.getDate().toString().padStart(2, '0');
                        const createElement = '<div class="wrapper sm:flex sm:flex-col"><div class="text-xl font-bold list-time">' + time + '</div><div class="sm:flex sm:flex-row text-cube-gray"><div>[' + dateText + ']</div></div>';
                        document.querySelector('#ao12 .content').insertAdjacentHTML('beforeend', createElement);
                    });
                }
            }
        }
    },
    keyDown: function (event) {
    },
    keyUp: function (event) {

    },
    ready: function () {

    },
    timer: function () {

    },
    timerView: function () {

    },
    timerStore: function () {

    },
    scramble: function () {

    }
};

records.init();
