class User {
  constructor(userData) {
    this.userData = userData.userData;
    this.token = userData.token;
    this.name = userData.data.name;
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

  static getUserPersmissions() {
    const data = User.getFromLocalStorage();
    return data ? data.permissions : null;
  }
}

export default User;
