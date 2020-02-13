import Sequelize, { Model } from 'sequelize';
import uuid from 'uuid/v4';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeCreate', file => {
      file.id = uuid();
    });
  }
}

export default File;
