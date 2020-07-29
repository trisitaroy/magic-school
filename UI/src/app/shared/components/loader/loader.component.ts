import { OnChanges, Component, OnInit, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnChanges, OnInit {

  @Input() isShowLoader: boolean = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isShowLoader'] && changes['isShowLoader'].currentValue) {
      this.isShowLoader = changes['isShowLoader'].currentValue;
    }
  }

  ngOnInit() {
  }

}
