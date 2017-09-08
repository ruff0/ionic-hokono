import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseProvider } from '../../providers/firebase/firebase';

import { User } from '../../models/user';
import { Post } from '../../models/post';

@IonicPage()
@Component({
  selector: 'page-following',
  templateUrl: 'following.html',
})
export class FollowingPage {

  user = {} as User;
  // posts
  posts: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private firebase: FirebaseProvider
  ) {

    this.afAuth.authState.subscribe(user => {
      if (!user) {
        this.user.displayName = 'Guest';
        return;
      }
      this.user.displayName = user.displayName;
    });

  }

  ionViewDidEnter() {
    this.firebase.getMyFollowingPosts()
      .then(newPosts => {
        this.posts = Object.values(newPosts).sort((a, b) => b.timeStamp - a.timeStamp);
      });
  }

  doRefresh(refresher) {
    this.firebase.getMyFollowingPosts()
      .then(newPosts => {
        this.posts = Object.values(newPosts).sort((a, b) => b.timeStamp - a.timeStamp);
        refresher.complete();
      });
  }

  goToPost(post) {
    this.navCtrl.push('PostPage', { post });
  }

  doUpVote(comment) {
    comment.likes++;
  }
}
