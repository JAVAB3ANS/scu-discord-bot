const  __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const fetch = require("node-fetch");

let Quarters;
(function (Quarters) {
    Quarters[Quarters["Summer"] = 60] = "Summer";
    Quarters[Quarters["Spring"] = 40] = "Spring";
    Quarters[Quarters["Winter"] = 20] = "Winter";
    Quarters[Quarters["Fall"] = 0] = "Fall";
})(Quarters || (Quarters = {})); 

class Client {
    constructor() { }
    // Convert quarter string to code
    resolveQuarter(quarter) {
        if (!quarter)
            quarter = "Spring 2022";
        let parts = quarter.split(" ");
        let season = Quarters[parts[0]];
        let year = (parseInt(parts[1]) - 1979) * 100;
        if (season === Quarters["Fall"])
            year += 100;
        return season + year;
    }

    search(query, quarter, underGrad = true, maxResults = 300) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const body = `q=${query.split(" ").join("+")}&maxRes=${maxResults}`;
            let quarterUrlComponent = this.resolveQuarter(quarter);
            let gradUrlComponent = underGrad ? "ugrad" : "grad";
            const URL = `https://www.scu.edu/apps/ws/courseavail/search/${quarterUrlComponent}/${gradUrlComponent}`;
            let response = yield fetch(URL, {
                body,
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).catch(reject);
            if (response) {
                let json = yield response.json().catch(reject);
                if (json === null || json === void 0 ? void 0 : json.results) {
                    json.results = json.results.map((course) => new Course(course));
                    resolve(json.results);
                }
                else {
                    reject(response);
                }
            }
        }));
    }
}

class Course {
    constructor(courseInfo) {
        Object.assign(this, courseInfo);
    }
    get instructor() {
        return this.instr_1;
    }
    get seats() {
        return parseInt(this.seats_remaining);
    }
    get isFull() {
        return this.has_seats > 0;
    }
}