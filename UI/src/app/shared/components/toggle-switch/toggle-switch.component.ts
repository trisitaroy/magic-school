import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit {

  @Input() toggleChecked: any;
  @Output() toggleValueChange: EventEmitter<any> = new EventEmitter();

  toggleSwitch: any;

  constructor() { }

  ngOnInit() {
    this.toggleSwitch = this.toggleChecked;
  }

  toggleSwitchChange() {
    this.toggleValueChange.emit(this.toggleSwitch);
  }
}
