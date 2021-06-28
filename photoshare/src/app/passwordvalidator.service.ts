import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface ValidationResult {
  [key: string]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordvalidatorService {

  constructor() { }

  public static strong(control: FormControl): ValidationResult {
    let special = /[0-9]+/g.test(control.value);

    const valid = special;
    if (!valid) {
        return { strong: true };
    }
    return null;
  } 

  public static numb_letters(control: FormControl): ValidationResult {
    const regex = /^[a-zA-Z0-9]+$/g;  

    let special = regex.test(control.value);

    const valid = special;
    if (!valid) {
        return { numb_letters: true };
    }
    return null;
  } 

  public static uppercase(control: FormControl): ValidationResult {
    let upper = /[A-Z]+/g.test(control.value);

    const valid = upper;
    if (!valid) {
        return { uppercase: true };
    }
    return null;
  }

  public static lowercase(control: FormControl): ValidationResult {
    let lower = /[a-z]+/g.test(control.value);

    const valid = lower;
    if (!valid) {
        return { lowercase: true };
    }
    return null;
  }  

  public static lowercase_special(control: FormControl): ValidationResult {
    let lower = /^[a-z0-9]+$/g.test(control.value);

    const valid = lower;
    if (!valid) {
        return { lowercase_special: true };
    }
    return null;
  }  
}
