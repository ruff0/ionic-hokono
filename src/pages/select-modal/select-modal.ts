import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-select-modal',
  templateUrl: 'select-modal.html',
})
export class SelectModalPage {

  title: string;
  selections: string[];

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) { }

  ionViewWillLoad() {
    this.title = this.navParams.get('title');
    this.selections = this.navParams.get('selections');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  // confirm(select) {
  //   this.viewCtrl.dismiss(select);
  // }

  confirm = (() => {
    let executed = false;
    return (select) => {
        if (!executed) {
          executed = true;
          this.viewCtrl.dismiss(select);
        }
      };
  })();
}
