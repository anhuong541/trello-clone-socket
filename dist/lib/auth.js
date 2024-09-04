"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewTasksProject = exports.generateUidByString = exports.checkUserIsAllowJoiningProject = void 0;
const tslib_1 = require("tslib");
const firebase_1 = require("../firebase");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const firestore_1 = require("firebase/firestore");
const checkUserIsAllowJoiningProject = (userId, projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.firestoreDB, `users`, userId, "projects", projectId))).exists();
});
exports.checkUserIsAllowJoiningProject = checkUserIsAllowJoiningProject;
const generateUidByString = (inputString) => {
    const hash = crypto_1.default.createHash("sha256");
    hash.update(inputString);
    const uid = hash.digest("hex");
    return uid.slice(0, 35);
};
exports.generateUidByString = generateUidByString;
const viewTasksProject = (projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.firestoreDB, "projects", projectId, "tasks"))).docs.map((item) => item.data());
});
exports.viewTasksProject = viewTasksProject;
//# sourceMappingURL=auth.js.map