export class DataProcessorLine {

    constructor() {
        this.maxY = 0;
    }

    randomRgba() {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ', 0.4)';
    }

    transform(dataset) {
        var color = this.randomRgba();

        var lineStructure = {
            type: 'line',
            label: dataset.target || "noAlias",
            borderColor: [color],
            backgroundColor: [color],
            data: [],
            fill: false
        }

        for (var i = 0; i < dataset.datapoints.length; i++) {
            lineStructure.data.push(
                this.buildLine(dataset.datapoints[i])
            );
        }

        return lineStructure;
    }

    buildLine(datapoints) {
        if (datapoints[0] > this.maxY)
            this.maxY = datapoints[0];

        return {
            x: new Date(datapoints[1]),
            y: datapoints[0]
        }
    }

    getMaxY() {
        return this.maxY;
    }

}