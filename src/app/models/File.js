import Sequelize, { Model } from 'sequelize';
import uuid from 'uuid/v4';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          },
        },
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
