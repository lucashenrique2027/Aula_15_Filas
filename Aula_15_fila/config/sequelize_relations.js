import UserModel from '../app/Models/UserModel.js';
import RoleModel from '../app/Models/RoleModel.js';

export default () => {
    UserModel.belongsTo(RoleModel, {
        foreignKey: "id_role",
        as: "role"
    });
        RoleModel.hasMany(UserModel, {
        foreignKey: "id_role",
        as: "users"
    });
}