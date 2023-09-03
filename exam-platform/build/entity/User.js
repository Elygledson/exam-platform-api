"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRoles = void 0;
var class_validator_1 = require("class-validator");
var typeorm_1 = require("typeorm");
var bcrypt = require("bcryptjs");
var UserRoles;
(function (UserRoles) {
    UserRoles["STANDARD"] = "STANDARD";
    UserRoles["ADMIN"] = "ADMIN";
})(UserRoles || (exports.UserRoles = UserRoles = {}));
var User = /** @class */ (function () {
    function User() {
    }
    User.prototype.hashPassword = function () {
        this.password = bcrypt.hashSync(this.password);
    };
    User.prototype.checkPassword = function (plainPass) {
        return bcrypt.compareSync(plainPass, this.password);
    };
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], User.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ unique: true }),
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.IsEmail)(),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ select: false }),
        (0, class_validator_1.Length)(6, 100),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], User.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], User.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        (0, typeorm_1.UpdateDateColumn)(),
        __metadata("design:type", Date)
    ], User.prototype, "updatedAt", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], User.prototype, "registerToken", void 0);
    User = __decorate([
        (0, typeorm_1.Entity)()
    ], User);
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map