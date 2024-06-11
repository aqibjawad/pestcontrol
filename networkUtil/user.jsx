class User {
  constructor(userData) {
    this.userData = userData;
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(this.userData));
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
    return data ? data.access_token : null;
  }
}

export default User;
