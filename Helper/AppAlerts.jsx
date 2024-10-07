import Swal from "sweetalert2";

export class AppAlerts {
  constructor() {}
  confirmAlert(text, callback) {
    Swal.fire({
      title: "Alert",
      text: text,
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        callback(); // Call the callback function when OK is clicked
      }
    });
  }

  errorAlert(text) {
    Swal.fire({
      title: "Alert",
      text: text,
      icon: "error",
      confirmButtonText: "OK",
    });
  }

  successAlert(text) {
    Swal.fire({
      title: "Alert",
      text: text,
      icon: "success",
      confirmButtonText: "OK",
    });
  }
}
