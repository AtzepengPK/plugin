export class DataProcessorLine {

    constructor(dataset) {
        this.dataset = dataset;
        this.lineStructure = {
            type: 'line',
            label: "noAlias",
            borderColor: ["rgba(0, 153, 255,0.8)"],
            backgroundColor: ["rgba(0, 153, 255,0.8)"],
            data: [],
            fill: false
        }
        this.maxY = 0;
        /*{
            type: 'line',
            label: 'My First dataset',
            borderColor: ["rgba(0, 153, 255,0.8)"],
            backgroundColor: ["rgba(0, 153, 255,0.8)"],
            data: [],
            fill: false
        }*/
    }

    transform() {
        this.lineStructure.label = this.dataset.target || "noAlias";
        this.lineStructure.data = [];

        for (var i = 0; i < this.dataset.datapoints.length; i++) {
            this.lineStructure.data.push(
                this.buildLine(this.dataset.datapoints[i])
            );
        }

        return this.lineStructure;
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
        console.log("asd")
        console.log(this.maxY)
        return this.maxY;
    }

}