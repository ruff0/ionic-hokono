import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseProvider } from '../../providers/firebase/firebase';

import { Pet } from '../../models/pet';
import { DOG_BREEDS } from '../../assets/dogs/breeds';

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {
  newPet = {} as Pet;
  searchBreed: string = '';
  showAutoComplete: boolean = false;
  breeds: string[];

  options: CameraOptions = {
    quality: 100,
    targetWidth: 500,
    targetHeight: 500,
    destinationType: this.camera.DestinationType.DATA_URL, // use file_uri in prod
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    // saveToPhotoAlbum: true,
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private firebase: FirebaseProvider,
    public toastCtrl: ToastController,
    private afAuth: AngularFireAuth
  ) {

    this.afAuth.authState.subscribe(user => {
      if (!user) {

        console.log('Not logged in');
      }
      // this.user.displayName = user.displayName;
    });


    this.newPet.name = '';
    this.newPet.age = {
      years: null,
      months: null
    };
    this.newPet.image = '';
    this.newPet.notes = '';
    this.newPet.species = {
      breed: ''
    };

    this.breeds = DOG_BREEDS.breeds;
  }

  async doTakePicture() {
    try {
      this.newPet.image = 'data:image/jpeg;base64,' + await this.camera.getPicture(this.options);
    } catch (e) {
      console.log('doTakePicture()', e);
    }
  }

  doGetPictures() {
    var picOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      targetWidth: 500,
      targetHeight: 500,
      allowEdit: true,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    this.camera.getPicture(picOptions)
      .then((url) => {
        console.log(url);
        this.newPet.image = 'data:image/jpeg;base64,' + url;
      })
      .catch((err) => {
        console.log('Failed to get picture');
      });
  }

  doSubmit() {
    console.log('new pet', this.newPet);
    this.firebase.postNewPet().push(this.newPet)
      .then(() => {
        this.toastCtrl.create({
          message: `${this.newPet.name} profile submitted`,
          duration: 20000,
          cssClass: 'toast-success'
        }).present();
      })
      .catch(() => {
        this.toastCtrl.create({
          message: `Failed to submit profile`,
          duration: 2000,
          cssClass: 'toast-fail'
        }).present();
      });
  }

  selectBreed(breed: string) {
    this.newPet.species.breed = breed;
    this.searchBreed = breed;
  }

  toggleShowAutoComplete() {
    setTimeout(() => {
      this.showAutoComplete = !this.showAutoComplete;
    }, 300);
  }
}
