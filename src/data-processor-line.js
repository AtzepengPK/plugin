export class DataProcessorLine {

    constructor(dataset) {
        this.dataset = dataset;
    }

    transform() {
        return {
            x: new Date(dataList[1]),
            y: dataList[0],
            description: "AHAHAH",
            xTimestamp: dataList[1]
        };
    }

}