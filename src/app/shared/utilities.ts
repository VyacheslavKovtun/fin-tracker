import { HttpHeaders } from "@angular/common/http";

export class Utilities {
    public static getDefaultHttpHeaders() {
        let headers = new HttpHeaders({'Content-Type':'application/json'});
        
        return headers;
    }
}