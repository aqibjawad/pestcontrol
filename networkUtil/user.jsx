class User {
  constructor(userData) {
    this.userData = userData.userData;
    this.token = userData.token;
    this.name = userData.data.name;
    this.roleId = userData.data.role_id; // Save role_id
    this.permissions = userData.permission.permission;
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(this));
    }
  }

  static getFromLocalStorage() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  static getAccessToken() {
    const data = User.getFromLocalStorage();
    return data ? data.token : null;
  }

  static getUserName() {
    const data = User.getFromLocalStorage();
    return data ? data.name : null;
  }

  static getUserRoleId() {
    const data = User.getFromLocalStorage();
    return data ? data.roleId : null; // Get role_id from local storage
  }

  static getUserPersmissions() {
    const data = User.getFromLocalStorage();
    return data ? data.permissions : null;
  }
}

export default User;
