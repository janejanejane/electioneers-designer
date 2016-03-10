import Phaser from 'phaser';


class DistrictSprite extends Phaser.Sprite {
  constructor( main, districtData ) {
    super( main.game, 0, 0, 'district' );
    this.data = districtData;
    this.x = districtData.position.x || 0;
    this.y = districtData.position.y || 0;

    this.anchor.x = this.anchor.y = 0.5;

    this.inputEnabled = true;
    this.input.enableDrag( false );
  }

  update() {
    if ( this.input.pointerOver() ) {
      this.alpha = 0.5;
    } else {
      this.alpha = 1;
    }
  }

}

export default DistrictSprite;
