import { DataTypes, Model } from 'sequelize';
import sequelize from '@/loaders/sequelize';

class Contact extends Model {
  public name!: string;
  public phone!: number;
  public email!: string;
}

Contact.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: 'contact',
  }
);

export default Contact;