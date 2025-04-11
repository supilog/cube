"use strict";
{
    async function dispData() {
        let results = await CubeDB.getData(1);
        results.sort(function (a, b) {
            return b.date - a.date;
        });
        document.getElementById('list').innerHTML = '';
        results.forEach(result => {
            const time = (result.time / 1000).toFixed(3);
            const dateTime = new Date(result.date);
            const dateText = dateTime.getFullYear().toString().padStart(4, '0')
                + '/' + (dateTime.getMonth() + 1).toString().padStart(2, '0')
                + '/' + dateTime.getDate().toString().padStart(2, '0');
            const createElement = '<div class="wrapper sm:flex sm:flex-col"><div class="text-xl font-bold list-time" cubeid="' + result.id + '">' + time + '</div><div class="sm:flex sm:flex-row text-cube-gray"><div>[' + dateText + ']</div><div>' + result.scramble + '</div></div></div>';
            document.getElementById('list').insertAdjacentHTML('beforeend', createElement);
        });
        const cubeTimes = document.querySelectorAll('.list-time');
        cubeTimes.forEach(function (cubeTime) {
            cubeTime.addEventListener('click', async function () {
                const cubeId = this.getAttribute('cubeid');
                const cube = await CubeDB.getSingleData(cubeId);
                const time = (cube.time / 1000).toFixed(3);
                const dateTime = new Date(cube.date);
                const dateText = dateTime.getFullYear().toString().padStart(4, '0')
                    + '/' + (dateTime.getMonth() + 1).toString().padStart(2, '0')
                    + '/' + dateTime.getDate().toString().padStart(2, '0') + ' '
                    + dateTime.getHours().toString().padStart(2, '0') + ':'
                    + dateTime.getMinutes().toString().padStart(2, '0')
                    + ':' + dateTime.getSeconds().toString().padStart(2, '0');
                document.querySelector('#show .id').innerHTML = cube.id;
                document.querySelector('#show .time').innerHTML = (time);
                document.querySelector('#show .scramble').innerHTML = cube.scramble;
                document.querySelector('#show .date').innerHTML = dateText;
                document.querySelector('#show .show-delete').setAttribute('cubeid', cube.id);
                document.getElementById('show').classList.add('is-active');
            });
        });
    };

    window.addEventListener('load', async function () {
        await dispData();
    });

    document.querySelector('#show .modal-close').addEventListener('click', function () {
        document.getElementById('show').classList.remove('is-active');
    });

    window.addEventListener('click', function (e) {
        const modal = document.getElementById('show');
        if (e.target === modal) {
            modal.classList.remove('is-active');
        }
    });

    document.querySelector('#show .show-delete').addEventListener('click', async function () {
        const result = await CubeDB.removeSingleData(this.getAttribute('cubeid'));
        document.getElementById('show').classList.remove('is-active');
        await dispData();
    });

}
