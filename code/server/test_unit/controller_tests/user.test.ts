import { test, expect, jest } from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import { Role, User } from "../../src/components/user";
import { UnauthorizedUserError, USER_NOT_ADMIN, UserIsAdminError, UserNotAdminError } from "../../src/errors/userError";

jest.mock("../../src/dao/userDAO")

describe("User Controller", () => {
    // Common user data for various tests
    let users: User[] = [];

    // Setup users before each test
    beforeEach(() => {
        users = [
            {
                username: "manager_user",
                name: "Manager",
                surname: "User",
                role: Role.MANAGER,
                address: "Manager Address",
                birthdate: "01-01-1980"
            },
            {
                username: "admin_user",
                name: "Admin",
                surname: "User",
                role: Role.ADMIN,
                address: "Admin Address",
                birthdate: "01-01-1985"
            },
            {
                username: "customer_user",
                name: "Customer",
                surname: "User",
                role: Role.CUSTOMER,
                address: "Customer Address",
                birthdate: "01-01-1990"
            }
        ];
    });

    // Clear mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe("Create User", () => {
        test("It should return true", async () => {
            const testUser = {
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: "Manager"
            };
            jest.spyOn(UserDAO.prototype, "createUser").mockResolvedValueOnce(true);
            const controller = new UserController();
            const response = await controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role);

            expect(UserDAO.prototype.createUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.createUser).toHaveBeenCalledWith(
                testUser.username,
                testUser.name,
                testUser.surname,
                testUser.password,
                testUser.role
            );
            expect(response).toBe(true);
        });
    });

    describe("Get Users", () => {
        test("It should return all users", async () => {
            jest.spyOn(UserDAO.prototype, "getUsers").mockResolvedValueOnce(users);
            const controller = new UserController();
            const response = await controller.getUsers();

            expect(UserDAO.prototype.getUsers).toHaveBeenCalledTimes(1);
            expect(response).toHaveLength(users.length);
            response.forEach(user => {
                expect(users).toContainEqual(user);
            });
        });
    })

    describe("Get User By Username", () => {
        test("Customer should get their own info", async () => {
            const testUser = users.find(user => user.role === Role.CUSTOMER);

            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(testUser);
            const controller = new UserController();
            const response = await controller.getUserByUsername(testUser.username);

            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledWith(testUser.username);
            expect(response).toBe(testUser);
        });

        test("Admin should get their own info", async () => {
            const testUser = users.find(user => user.role === Role.ADMIN);

            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(testUser);
            const controller = new UserController();
            const response = await controller.getUserByUsername(testUser.username);

            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledWith(testUser.username);
            expect(response).toBe(testUser);
        });

        test("Manager should get their own info", async () => {
            const testUser = users.find(user => user.role === Role.MANAGER);

            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(testUser);
            const controller = new UserController();
            const response = await controller.getUserByUsername(testUser.username);

            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledWith(testUser.username);
            expect(response).toBe(testUser);
        });

        test("Admin can get other user info", async () => {
            const testAdmin = users.find(user => user.role === Role.ADMIN);
            const testUser = users.find(user => user.role === Role.CUSTOMER);

            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(testUser);
            const controller = new UserController();
            const response = await controller.getUserByUsername(testUser.username);

            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledWith(testUser.username);
            expect(response).toBe(testUser);
        });
    });

    describe("Get Users By Role", () => {
        test("It should return all managers", async () => {
            const role = Role.MANAGER;
            const expectedUsers = users.filter(user => user.role === role);

            jest.spyOn(UserDAO.prototype, "getUsersByRole").mockResolvedValueOnce(expectedUsers);
            const controller = new UserController();
            const response = await controller.getUsersByRole(role);

            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledWith(role);
            expect(response).toHaveLength(expectedUsers.length);
            response.forEach(user => {
                expect(user.role).toBe(role);
            });
        });

        test("It should return all admins", async () => {
            const role = Role.ADMIN;
            const expectedUsers = users.filter(user => user.role === role);

            jest.spyOn(UserDAO.prototype, "getUsersByRole").mockResolvedValueOnce(expectedUsers);
            const controller = new UserController();
            const response = await controller.getUsersByRole(role);

            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledWith(role);
            expect(response).toHaveLength(expectedUsers.length);
            response.forEach(user => {
                expect(user.role).toBe(role);
            });
        });

        test("It should return all customers", async () => {
            const role = Role.CUSTOMER;
            const expectedUsers = users.filter(user => user.role === role);

            jest.spyOn(UserDAO.prototype, "getUsersByRole").mockResolvedValueOnce(expectedUsers);
            const controller = new UserController();
            const response = await controller.getUsersByRole(role);

            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledWith(role);
            expect(response).toHaveLength(expectedUsers.length);
            response.forEach(user => {
                expect(user.role).toBe(role);
            });
        });

        test("It should return an empty array for a non-existent role", async () => {
            const role = "NON_EXISTENT_ROLE";

            jest.spyOn(UserDAO.prototype, "getUsersByRole").mockResolvedValueOnce([]);
            const controller = new UserController();
            const response = await controller.getUsersByRole(role);

            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledWith(role);
            expect(response).toHaveLength(0);
        });
    });

    describe("Update User Info", () => {
        test("Non-admin user tries to update another user's information", async () => {
            const customerUser = users.find(user => user.role === Role.CUSTOMER);
            const adminUser = users.find(user => user.role === Role.ADMIN);

            jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(adminUser);

            const controller = new UserController();
            try {
                await controller.updateUserInfo(customerUser, "New Name", "New Surname", "New Address", "01-01-1991", adminUser.username);
            } catch (error) {
                expect(error).toBeInstanceOf(UserNotAdminError);
            }
        });

        test("Admin user tries to update another admin's information", async () => {
            const adminUser1 = users.find(user => user.role === Role.ADMIN);
            const adminUser2 = { ...adminUser1, username: "admin_user_2", address: "Other Address" };

            jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(adminUser2);

            const controller = new UserController();
            try {
                await controller.updateUserInfo(adminUser1, "New Name", "New Surname", "New Address", "01-01-1991", adminUser2.username);
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedUserError);
            }
        });

        test("Admin user successfully updates another user's information", async () => {
            const adminUser = users.find(user => user.role === Role.ADMIN);
            const customerUser = users.find(user => user.role === Role.CUSTOMER);
            const updatedUser = { ...customerUser, name: "Updated Name" };

            jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(customerUser);
            jest.spyOn(UserDAO.prototype, "updateUserInfo").mockResolvedValueOnce(updatedUser);

            const controller = new UserController();
            const response = await controller.updateUserInfo(adminUser, "Updated Name", customerUser.surname, customerUser.address, customerUser.birthdate, customerUser.username);

            expect(response.name).toBe("Updated Name");
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledWith("Updated Name", customerUser.surname, customerUser.address, customerUser.birthdate, customerUser.username);
        });

        test("User successfully updates their own information", async () => {
            const customerUser = users.find(user => user.role === Role.CUSTOMER);
            const updatedUser = { ...customerUser, name: "Updated Name" };

            jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(customerUser);
            jest.spyOn(UserDAO.prototype, "updateUserInfo").mockResolvedValueOnce(updatedUser);

            const controller = new UserController();
            const response = await controller.updateUserInfo(customerUser, "Updated Name", customerUser.surname, customerUser.address, customerUser.birthdate, customerUser.username);

            expect(response.name).toBe("Updated Name");
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledWith("Updated Name", customerUser.surname, customerUser.address, customerUser.birthdate, customerUser.username);
        });

        test("only the provided fields are updated", async () => {
            const customerUser = users.find(user => user.role === Role.CUSTOMER);
            const updatedUser = { ...customerUser, name: "Updated Name", surname: "Updated Surname" };

            jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(customerUser);
            jest.spyOn(UserDAO.prototype, "updateUserInfo").mockResolvedValueOnce(updatedUser);

            const controller = new UserController();
            const response = await controller.updateUserInfo(customerUser, "Updated Name", "Updated Surname", customerUser.address, customerUser.birthdate, customerUser.username);

            expect(response.name).toBe("Updated Name");
            expect(response.surname).toBe("Updated Surname");
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledWith("Updated Name", "Updated Surname", customerUser.address, customerUser.birthdate, customerUser.username);
        });
    });

    describe("Delete User", () => {
        test("Non-admin user cannot delete another user", async () => {
            const customerUser = users.find(user => user.role === Role.CUSTOMER);
            const managerUser = users.find(user => user.role === Role.MANAGER);

            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(managerUser);

            const controller = new UserController();
            try {
                await controller.deleteUser(managerUser.username);
            } catch (error) {
                expect(error).toBeInstanceOf(UserNotAdminError);
            }
        });

        test("Admin user deletes another non-admin user", async () => {
            const adminUser = users.find(user => user.role === Role.ADMIN);
            const customerUser = users.find(user => user.role === Role.CUSTOMER);

            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(customerUser);
            jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValueOnce(true);

            const controller = new UserController();
            const response = await controller.deleteUser(customerUser.username);

            expect(response).toBe(true);
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledWith(customerUser.username);
        });

        test("Admin user cannot delete another admin user", async () => {
            const adminUser1 = users.find(user => user.role === Role.ADMIN);
            const adminUser2 = { ...adminUser1, username: "admin_user_2", address: "Other Address" };

            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(adminUser2);

            const controller = new UserController();
            try {
                await controller.deleteUser(adminUser2.username);
            } catch (error) {
                expect(error).toBeInstanceOf(UserIsAdminError);
            }
        });

        test("User can delete their own account", async () => {
            const customerUser = users.find(user => user.role === Role.CUSTOMER);

            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(customerUser);
            jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValueOnce(true);

            const controller = new UserController();
            const response = await controller.deleteUser(customerUser.username);

            expect(response).toBe(true);
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledWith(customerUser.username);
        });
    });

    describe("Delete All Non-Admin Users", () => {
        test("Non-admin user cannot delete all non-admin users", async () => {
            const managerUser = users.find(user => user.role === Role.MANAGER);

            const controller = new UserController();
            try {
                await controller.deleteAll(managerUser);
            } catch (error) {
                expect(error).toBeInstanceOf(UserNotAdminError);
            }
        });

        test("Admin user deletes all non-admin users", async () => {
            const adminUser = users.find(user => user.role === Role.ADMIN);

            jest.spyOn(UserDAO.prototype, "deleteAll").mockResolvedValueOnce(true);

            const controller = new UserController();
            const response = await controller.deleteAll(adminUser);

            expect(response).toBe(true);
            expect(UserDAO.prototype.deleteAll).toHaveBeenCalledTimes(1);
        });
    });
});