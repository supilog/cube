"use strict";
{
    window.addEventListener('load', async function () {
        await dispGraph();
    });

    async function dispGraph(dataset) {
        const container = document.querySelector('.canvas-container');
        const myChart = document.querySelector('#myChart');
        myChart.setAttribute('width', container.clientWidth);
        myChart.setAttribute('height', container.clientHeight);
        let results = await CubeDB.getData(1);
        const ctx = document.getElementById('myChart');
        const idArr = results.map(item => item["id"]);
        const dataArr = results.map(item => item["time"] / 1000);
        const config = {
            type: 'line',
            data: {
                labels: idArr,
                datasets: [{
                    label: '# time(sec)',
                    data: dataArr,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            },
            plugins: []
        }
        new Chart(ctx, config);
    }
}
