(function () {
    console.log(1);
    fetch('http://norvig.com/big.txt', { headers: { 'Content-Type': 'text/plain' } })
        .then(response => {
            return response.text().then(function (text) {
                parseFileAndGetArray(text);
            });
        })
        .catch(error => console.error('Error:', error));

    function parseFileAndGetArray(file) {
        var tempStr = file.replace(/[\*\.\"\[\]\#\(\)\,\?\'\:\;\!\+\-\|]/g, '').replace(/[\n\t]/g, " ").replace(/ \w /g, ' ').replace(/  +/g, ' ');
        var tempArr = (tempStr.split(" "));

        var wordCountObj = getWordCountObj(tempArr);
        var topTenArr = getTopTenArr(wordCountObj);

        var finalObj = {};
        topTenArr.forEach(function (item, index) {
            var tempObj = {
                count: wordCountObj[item]
            }
            finalObj[item] = tempObj;
            fetch('https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-en&text=' + item)
                .then(response => {
                    return response.json().then(function (text) {
                        var res = text.def;
                        finalObj[item].pos = getSynAndPos(res)[0];
                        finalObj[item].syn = getSynAndPos(res)[1];
                    });
                })
                .catch(error => console.error('Error:', error));
        });
        console.log(finalObj);
    }

    function getWordCountObj(tempArr) {
        var obj = {};
        tempArr.forEach(function (item, index) {
            if (obj.hasOwnProperty(item)) {
                obj[item] = obj[item] + 1;
            } else {
                obj[item] = 1;
            }
        });
        return obj;
    }

    function getTopTenArr(obj) {
        var sortedObj = Object.keys(obj).sort(function (a, b) {
            return obj[b] - obj[a];
        });
        var topTenArr = sortedObj.splice(0, 10);
        return topTenArr;
    }

    function getSynAndPos(obj) {
        var finalSynArr = [];
        var finalPosArr = [];
        obj.forEach(function (item, index) {
            item.tr.forEach(function (item1, index1) {
                if (item1.hasOwnProperty('syn')) {
                    item1.syn.forEach(function (item2, index2) {
                        finalSynArr.push(item2.text);
                    });
                }
                finalPosArr.indexOf(item1.pos) == -1 ? finalPosArr.push(item1.pos) : '';
            });

        });
        return [finalPosArr, finalSynArr];
    }
})();





