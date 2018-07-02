export class DataProcessorBar {
    constructor() {
    }

    randomRgba() {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ', 0.4)';
    }

    transform(dataset) {
        console.log("HA!")
        var color = this.randomRgba();

        var barStructure = {
            type: 'bar',
            label: dataset.target || "noAlias",
            borderColor: color,
            backgroundColor: color,
            data: []
        }

        for (var i = 0; i < dataset.datapoints.length; i++) {
            barStructure.data.push(
                this.buildLine(dataset.datapoints[i])
            );
        }

        return barStructure;
    }

    buildLine(datapoints) {

        return {
            x: new Date(datapoints[1]),
            y: datapoints[0]
        }
    }
}