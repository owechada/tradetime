import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/database';
import { v4 as uuidv4 } from 'uuid';

class User extends Model {
  public id!: number;
  public username!: string;
  public mail!: string;
  public password!: string;
  public is_admin!: number;
  public mailChimp!: string;
  public isSubBefore!: string;
  public tradeViewName!: string;
  public is_trial!: string;
  public token!: string;
  public checked!: number;
  public activation!: string;
  public comment!: string;
  public subExpiryDate!: string;
  public ip!: string;
  public exp_date!: string;
  public subscription_id!: string;


  
  // public async validPassword(password: string): Promise<boolean> {
  //   return await bcrypt.compare(password, this.password);
  // }
  public  validPassword(password: string):boolean {
    return (password==this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.STRING,  // Changed from INTEGER to STRING
      primaryKey: true,
      defaultValue: () => uuidv4(),  // Generates a random UUID string
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    trade_view_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"NULL"
    },
    activation: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"NULL"
    },
    is_sub_before: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"NULL"
    },
    exp_date: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"NULL"
    },


  
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"NULL"
    },
    checked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:1
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue:"NULL"
    },
    subscription_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"NULL"
    },
    subExpiryDate: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"NULL"
    },
    is_trial: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"NULL"
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"NULL"
    },
    mail_chimp: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"NULL"
    },
  },
  {
    sequelize,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

export default User;
