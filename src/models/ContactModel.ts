import { DataTypes, Model } from 'sequelize';
import sequelize from '@/loaders/sequelize';

class Contact extends Model {
  public name!: string;
  public phone!: number;
  public email!: string;
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'contact',
    timestamps: false, // ✅ Disable timestamps
  }
);


export default Contact;