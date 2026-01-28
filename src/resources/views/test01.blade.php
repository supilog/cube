@extends('layouts.app')

@section('content')
    <div class="sm:flex sm:flex-col">
        <div class="sm:flex sm:justify-center text-4xl">
            <button id="export">export</button>
        </div>
        <div class="sm:flex sm:justify-center text-4xl">
            <input type="file" id="import" value="import"/>
        </div>
    </div>
@endsection

@section('js')
    <script src="/js/database.js"></script>
    <script>
        document.getElementById('export').addEventListener('click', async function () {
            const results = await CubeDB.getAllData();
            const blob = new Blob([JSON.stringify(results, null, '  ')], {
                type: 'application/json',
            });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'exportCube.json';
            link.click();
            link.remove();
        });
        window.addEventListener('load', () => {
            const f = document.getElementById('import');
            console.log('load');
            f.addEventListener('change', evt => {
                console.log('change');
                let input = evt.target;
                console.log(input.files.length);
                if (input.files.length == 0) {
                    console.log('No file selected');
                    return;
                }

                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = () => {
                    const json = JSON.parse(reader.result);
                    json.forEach(function(cube) {
                        delete cube.id;
                        CubeDB.storeData(cube);
                    });
                };
                reader.readAsText(file);
            });
        });
    </script>
@endsection
