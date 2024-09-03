class UIHelper {
  static formatDateString(dateStr) {
    const date = new Date(dateStr);

    const day = date.getUTCDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getUTCFullYear();

    return `${day} ${month}, ${year}`;
  }
}

export default UIHelper;
