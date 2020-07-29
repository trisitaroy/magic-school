import { FormControl, FormGroup, FormArray } from '@angular/forms';


/**
 * @param name - Full Name
 */
export function getShortName(name: string) {
    let shortName = '';
    if (name.length > 0 && name.indexOf(' ') > -1) {
        const splittedNameList = name.split(' ');
        shortName +=
            splittedNameList[0][0].toUpperCase() +
            splittedNameList[1][0].toUpperCase();
    }
    return shortName;
}

/**
 * @param form - Form instance
 * @param groupName - Group Name To get controls as FormGroup
 */
export function getFormAttributeAsFormGroup(form: FormGroup, groupName: string): FormGroup {
    return form.get(groupName) as FormGroup;
}

/**
 * @param groupName - FormGroup Instance
 * @param arrayName - FormArray Attribiute
 */
export function getFormAttributeAsFormArray(groupName: FormGroup, arrayName: string): FormArray {
    return groupName.get(arrayName) as FormArray;
}

/**
 * @param grouporArrayName - FormGroup / FormArray instances
 * @param controlName - FormControl Attribute
 */
export function getFormAttributeAsFormControl(grouporArrayName: FormGroup | FormArray, controlName: string): FormControl {
    return grouporArrayName.get(controlName) as FormControl;
}