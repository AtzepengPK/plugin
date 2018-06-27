import { DataProcessorLine } from './data-processor-line';
import { DataProcessorBar } from './data-processor-bar';
import { DataProcessorAnnotation } from './data-processor-annotation';

export class DataProcessor {
    constructor() { }

    transformData(type, dataSet) {
        console.log(type);
        console.log(dataSet);
        switch (type) {
            default:
            case "line":
                return new DataProcessorLine(dataSet).transform();
            case "bar":
                return new DataProcessorBar(dataSet).transform();
            case "annotation":
                return new DataProcessorAnnotation(dataSet).transform();
        }
    }
}

