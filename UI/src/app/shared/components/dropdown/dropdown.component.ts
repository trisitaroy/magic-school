import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit, OnChanges {

  @Input() inputLabelId: string;
  @Input() value: string = '';
  @Input() dropdownData: any[];
  @Input() disabled: boolean;
  @Input() isShowChooseOption: boolean = true;
  @Output() selectedValueChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('matSelect', { static: true }) matSelect: MatSelect;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.value = changes['value'].currentValue ? changes['value'].currentValue : '';
    }
    if (changes['isShowChooseOption'] && changes['isShowChooseOption'].currentValue) {
      this.isShowChooseOption = changes['isShowChooseOption'].currentValue;
    }
  }

  ngOnInit() {

  }

  public selectionChanged(event: string | any): void {
    this.selectedValueChange.emit(event.value);
  }

  openSelectBox() {
    this.matSelect.open();
  }

}
